/**
 * Push local git tree to GitHub via REST API using Replit connectors SDK.
 * Usage: node scripts/github-push.mjs
 */
import { ReplitConnectors } from "@replit/connectors-sdk";
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";

const OWNER = "julesindigo-web";
const REPO  = "priastama.adiyoga";
const BRANCH = "main";

const connectors = new ReplitConnectors();

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ghApi(endpoint, method = "GET", body = null, retries = 5) {
  const opts = { method };
  if (body) opts.body = JSON.stringify(body);
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await connectors.proxy("github", endpoint, opts);
    if (res.status === 429) {
      const wait = 1200 * (attempt + 1);
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub API ${method} ${endpoint} → ${res.status}: ${text.slice(0,200)}`);
    }
    return res.json();
  }
  throw new Error(`GitHub API ${method} ${endpoint} → too many rate-limit retries`);
}

async function createBlob(content, encoding = "base64") {
  return ghApi(`/repos/${OWNER}/${REPO}/git/blobs`, "POST", { content, encoding });
}

async function run() {
  console.log("📋 Listing tracked files…");
  const files = execSync("git ls-files --full-name", { cwd: "/home/runner/workspace" })
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);

  console.log(`→ ${files.length} files to push`);

  // Get current remote HEAD (may fail if branch new)
  let baseTreeSha = null;
  let parentSha   = null;
  try {
    const ref = await ghApi(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`);
    parentSha   = ref.object.sha;
    const commit = await ghApi(`/repos/${OWNER}/${REPO}/git/commits/${parentSha}`);
    baseTreeSha  = commit.tree.sha;
    console.log(`→ Remote HEAD: ${parentSha.slice(0,8)} (tree ${baseTreeSha.slice(0,8)})`);
  } catch (e) {
    console.log("→ No existing remote branch, will create fresh.");
  }

  // Get git modes for all files at once
  console.log("📦 Reading git modes…");
  const stagingInfo = execSync("git ls-files --stage", { cwd: "/home/runner/workspace" })
    .toString().trim().split("\n").filter(Boolean);
  const modeMap = {};
  for (const line of stagingInfo) {
    const parts = line.split(/\s+/);
    if (parts.length >= 4) {
      // format: mode SHA stage\tpath  (tab before path)
      const tabIdx = line.indexOf("\t");
      const fp = tabIdx >= 0 ? line.slice(tabIdx + 1) : parts[3];
      modeMap[fp] = parts[0];
    }
  }

  // Create blobs — batches of 8, 150ms gap between batches (stay under 10 RPS)
  console.log("📦 Creating blobs in parallel (batch=8, throttled)…");
  const treeEntries = [];
  let done = 0;
  const BATCH = 8;

  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(async (filePath) => {
      const absPath = path.join("/home/runner/workspace", filePath);
      if (!existsSync(absPath)) return null;
      const buf = readFileSync(absPath);
      const blob = await createBlob(buf.toString("base64"), "base64");
      const mode = modeMap[filePath] === "100755" ? "100755" : "100644";
      return { path: filePath, mode, type: "blob", sha: blob.sha };
    }));

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        treeEntries.push(r.value);
        done++;
      } else if (r.status === "rejected") {
        console.log(`  ERROR: ${r.reason?.message}`);
      }
    }
    if (done % 40 === 0 || i + BATCH >= files.length) console.log(`  ${done}/${files.length} blobs done…`);
    // 150ms gap keeps us comfortably under 10 RPS across the batch
    await sleep(150);
  }

  console.log(`✅ ${done} blobs ready`);

  // Create tree
  console.log("🌳 Creating tree…");
  const treePayload = { tree: treeEntries };
  // Don't use base_tree so we get a clean tree with only tracked files
  const newTree = await ghApi(`/repos/${OWNER}/${REPO}/git/trees`, "POST", treePayload);
  console.log(`→ Tree SHA: ${newTree.sha.slice(0,8)}`);

  // Get local commit message
  const localMessage = execSync("git log -1 --pretty=%B", { cwd: "/home/runner/workspace" })
    .toString().trim();
  const localAuthor = {
    name:  execSync("git log -1 --pretty=%an", { cwd: "/home/runner/workspace" }).toString().trim() || "Priastama Adiyoga",
    email: execSync("git log -1 --pretty=%ae", { cwd: "/home/runner/workspace" }).toString().trim() || "adiyoga.hse@gmail.com",
    date:  new Date().toISOString(),
  };

  // Create commit
  console.log("📝 Creating commit…");
  const commitPayload = {
    message: localMessage,
    tree:    newTree.sha,
    author:  localAuthor,
    committer: localAuthor,
    ...(parentSha ? { parents: [parentSha] } : { parents: [] }),
  };
  const newCommit = await ghApi(`/repos/${OWNER}/${REPO}/git/commits`, "POST", commitPayload);
  console.log(`→ Commit SHA: ${newCommit.sha.slice(0,8)}`);

  // Force-update (or create) the ref
  console.log(`🚀 Updating refs/heads/${BRANCH}…`);
  try {
    await ghApi(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, "PATCH", {
      sha:   newCommit.sha,
      force: true,
    });
  } catch {
    // Ref doesn't exist yet — create it
    await ghApi(`/repos/${OWNER}/${REPO}/git/refs`, "POST", {
      ref: `refs/heads/${BRANCH}`,
      sha: newCommit.sha,
    });
  }

  console.log(`\n✅ Successfully pushed ${done} files to github.com/${OWNER}/${REPO} (${BRANCH})`);
  console.log(`   Commit: ${newCommit.sha}`);
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
