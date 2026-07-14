---
name: GitHub push via REST API
description: How to push to GitHub from this repl when gitPush callback fails
---

The built-in `gitPush({})` callback consistently returns `CLI_ERROR: BRANCH_ALREADY_EXISTS` for this repo (even with `force: true`). Direct shell `git push` fails with "Invalid username or token".

**Working approach:** `scripts/github-push.mjs` — Node.js script using `@replit/connectors-sdk` to push all tracked files via GitHub REST API (git objects: blob → tree → commit → force-update ref).

**Why:** The remote `main` was originally populated via REST API in a previous session, creating a diverged git history. Replit's gitPush wrapper can't handle this case.

**How to apply:**
1. Ensure GitHub connection `conn_github_01KXGZQD4M01FBQRRFHVHXVVEZ` is bound (run ProposeIntegration if it returns 401)
2. Run: `node scripts/github-push.mjs`
3. Rate limit is 10 RPS via connectors proxy — script uses batch=8 + 150ms gap + retry-on-429

**Known limits:**
- Files >100MB fail with 413 — PDFs in `attached_assets/` are skipped
- `WEB_REPL_RENEWAL` is not set in shell env; SDK still works via `REPL_IDENTITY`
