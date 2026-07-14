import { useEffect, useRef } from "react";

// Color palette extracted from reference image
// Navy midnight: #020a18, #061228, #0a1e38
// Gold/amber lines: #c8a84a, #d4b558, #e8c870, #ffc840
// Electric blue accent: #1455cc, #2280ff, #4da6ff
// White/gold sparkles: rgba(255,220,120,0.9), rgba(255,255,255,0.8)

export function RoyalNight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ── Gold sparkle particles (matching image's lower-left cluster)
    type Sparkle = {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number; gold: boolean;
    };
    const sparkles: Sparkle[] = Array.from({ length: 180 }, () => spawnSparkle(W(), H()));

    function spawnSparkle(w: number, h: number): Sparkle {
      // Concentrate around the golden wave area (bottom-left to center)
      const zone = Math.random();
      let x: number, y: number;
      if (zone < 0.5) {
        // Bottom-left gold cluster — matching image
        x = Math.random() * w * 0.45;
        y = h * 0.55 + Math.random() * h * 0.45;
      } else if (zone < 0.8) {
        // Along the golden sweep line
        const t = Math.random();
        x = w * 0.1 + t * w * 0.7;
        y = h * 0.8 - t * h * 0.4 + (Math.random() - 0.5) * 60;
      } else {
        // Scattered
        x = Math.random() * w;
        y = Math.random() * h;
      }
      const maxLife = 80 + Math.random() * 160;
      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.15 - Math.random() * 0.5,
        life: Math.random() * maxLife,
        maxLife,
        size: 0.6 + Math.random() * 2.4,
        gold: Math.random() > 0.25,
      };
    }

    // ── Flowing light streams (mimicking the golden arcs)
    type StreamPoint = { x: number; y: number };
    type Stream = {
      pts: StreamPoint[];
      speed: number;
      width: number;
      alpha: number;
      progress: number;
      color: string;
    };

    function makeStream(w: number, h: number, isGold: boolean): Stream {
      // Arc from bottom-left sweeping up-right, like the image
      const startX = Math.random() * w * 0.3;
      const startY = h * 0.7 + Math.random() * h * 0.3;
      const endX = w * 0.6 + Math.random() * w * 0.4;
      const endY = Math.random() * h * 0.4;
      const cp1x = startX + w * 0.15;
      const cp1y = startY - h * 0.2;
      const cp2x = endX - w * 0.2;
      const cp2y = endY + h * 0.2;

      // Sample bezier
      const pts: StreamPoint[] = [];
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const mt = 1 - t;
        pts.push({
          x: mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*endX,
          y: mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY,
        });
      }

      return {
        pts,
        speed: 0.003 + Math.random() * 0.005,
        width: isGold ? 0.4 + Math.random() * 1.2 : 0.3 + Math.random() * 0.7,
        alpha: isGold ? 0.35 + Math.random() * 0.45 : 0.15 + Math.random() * 0.25,
        progress: Math.random(),
        color: isGold
          ? `rgba(${200 + Math.random() * 50},${160 + Math.random() * 50},${40 + Math.random() * 40},`
          : `rgba(${40 + Math.random() * 40},${100 + Math.random() * 80},${200 + Math.random() * 55},`,
      };
    }

    const streams: Stream[] = [
      ...Array.from({ length: 9 }, () => makeStream(W(), H(), true)),   // gold
      ...Array.from({ length: 5 }, () => makeStream(W(), H(), false)),  // blue
    ];

    // ── Stars (sparse, matching image's subtle star field in navy area)
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.9,
      a: 0.1 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.0,
    }));

    let t = 0;

    const draw = () => {
      const w = W(), h = H();

      // Clear
      ctx.clearRect(0, 0, w, h);

      // ── Image background (dark overlay applied via globalAlpha trick)
      // The image is already dark navy — draw it directly
      // We don't have access to the DOM image here so we replicate the deep
      // navy gradient that underlies the photo
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#020a1a");
      base.addColorStop(0.3, "#06122a");
      base.addColorStop(0.65, "#0a1e3a");
      base.addColorStop(1, "#04102a");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Blue atmosphere (right side, matching image's electric blue zone)
      const blueGlow = ctx.createRadialGradient(w * 0.82, h * 0.3, 0, w * 0.82, h * 0.3, w * 0.45);
      blueGlow.addColorStop(0, "rgba(30,90,220,0.18)");
      blueGlow.addColorStop(0.4, "rgba(18,55,160,0.10)");
      blueGlow.addColorStop(1, "transparent");
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, w, h);

      // Gold warm glow (bottom-left, matching image's sparkle origin)
      const goldGlow = ctx.createRadialGradient(w * 0.18, h * 0.82, 0, w * 0.18, h * 0.82, w * 0.38);
      goldGlow.addColorStop(0, "rgba(200,160,40,0.14)");
      goldGlow.addColorStop(0.5, "rgba(160,120,20,0.06)");
      goldGlow.addColorStop(1, "transparent");
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, w, h);

      // ── Stars
      stars.forEach((s) => {
        const a = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,225,255,${a})`;
        ctx.fill();
      });

      // ── Flowing light streams
      streams.forEach((stream) => {
        stream.progress = (stream.progress + stream.speed) % 1;
        const tailLen = 0.18;
        const start = stream.progress;
        const end = (stream.progress + tailLen) % 1;

        // Draw the stream as a glowing path segment
        const segStart = Math.floor(start * 80);
        const segEnd = Math.floor(end * 80);
        const pts = stream.pts;

        if (segEnd > segStart && pts.length > 1) {
          // Glow layer (wide, soft)
          ctx.beginPath();
          ctx.moveTo(pts[segStart].x, pts[segStart].y);
          for (let i = segStart + 1; i <= Math.min(segEnd, pts.length - 1); i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.strokeStyle = `${stream.color}${stream.alpha * 0.3})`;
          ctx.lineWidth = stream.width * 5;
          ctx.lineCap = "round";
          ctx.shadowBlur = 12;
          ctx.shadowColor = stream.color + "0.4)";
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Core line (sharp)
          ctx.beginPath();
          ctx.moveTo(pts[segStart].x, pts[segStart].y);
          for (let i = segStart + 1; i <= Math.min(segEnd, pts.length - 1); i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.strokeStyle = `${stream.color}${stream.alpha})`;
          ctx.lineWidth = stream.width;
          ctx.stroke();

          // Bright head spark
          const headIdx = Math.min(segEnd, pts.length - 1);
          const headX = pts[headIdx].x;
          const headY = pts[headIdx].y;
          const headGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 6);
          headGrad.addColorStop(0, `${stream.color}0.9)`);
          headGrad.addColorStop(1, "transparent");
          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.arc(headX, headY, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ── Sparkle particles
      sparkles.forEach((sp, idx) => {
        sp.life += 1;
        sp.x += sp.vx;
        sp.y += sp.vy;

        if (sp.life >= sp.maxLife) {
          sparkles[idx] = spawnSparkle(w, h);
          return;
        }

        const progress = sp.life / sp.maxLife;
        // Fade in/out
        const alpha = progress < 0.15
          ? (progress / 0.15)
          : progress > 0.75
            ? (1 - (progress - 0.75) / 0.25)
            : 1;

        const size = sp.size * alpha;

        if (sp.gold) {
          // Gold sparkle: cross/star shape
          const brightness = 0.6 + 0.4 * Math.sin(t * 3 + sp.life * 0.1);
          const r = Math.floor(220 + 35 * brightness);
          const g = Math.floor(170 + 50 * brightness);
          const b = Math.floor(40 + 40 * brightness);
          const a = alpha * 0.85;

          // Glow halo
          const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, size * 4);
          grd.addColorStop(0, `rgba(${r},${g},${b},${a * 0.5})`);
          grd.addColorStop(1, "transparent");
          ctx.fillStyle = grd;
          ctx.fillRect(sp.x - size * 4, sp.y - size * 4, size * 8, size * 8);

          // Cross star
          ctx.save();
          ctx.translate(sp.x, sp.y);
          ctx.rotate(t * 0.5 + sp.life * 0.05);
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fillRect(-size * 0.15, -size, size * 0.3, size * 2);
          ctx.fillRect(-size, -size * 0.15, size * 2, size * 0.3);
          // Diagonal arms (smaller)
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.5})`;
          ctx.fillRect(-size * 0.1, -size * 0.6, size * 0.2, size * 1.2);
          ctx.fillRect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.2);
          ctx.restore();
        } else {
          // Blue-white particle (fine dots)
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,210,255,${alpha * 0.6})`;
          ctx.fill();
        }
      });

      // ── Horizontal shimmer lines (barely visible, like in image)
      for (let i = 0; i < 3; i++) {
        const ly = h * (0.48 + i * 0.12) + Math.sin(t * 0.3 + i) * 20;
        const shimmer = ctx.createLinearGradient(0, ly, w, ly);
        shimmer.addColorStop(0, "transparent");
        shimmer.addColorStop(0.2, `rgba(200,165,50,${0.02 + Math.sin(t * 0.5 + i) * 0.01})`);
        shimmer.addColorStop(0.6, `rgba(200,165,50,${0.04 + Math.sin(t * 0.4 + i) * 0.02})`);
        shimmer.addColorStop(1, "transparent");
        ctx.fillStyle = shimmer;
        ctx.fillRect(0, ly - 0.5, w, 1);
      }

      // ── Vignette
      const vig = ctx.createRadialGradient(w * 0.4, h * 0.45, h * 0.1, w * 0.4, h * 0.45, h * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(2,8,18,0.72)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      t += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Palette derived from image
  const gold = "#c8a84a";
  const goldBright = "#e8c870";
  const blue = "#2a7fff";
  const navy = "#0a1628";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: navy,
        fontFamily: "'Syne', 'Inter', sans-serif",
      }}
    >
      {/* Reference image as base layer */}
      <img
        src="/__mockup/images/royal-night-bg.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          filter: "brightness(0.55) saturate(1.1)",
          zIndex: 0,
        }}
      />

      {/* Animated particle canvas on top */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          mixBlendMode: "screen",
        }}
      />

      {/* Dark gradient overlay — ensures text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "linear-gradient(120deg, rgba(2,10,26,0.65) 0%, rgba(4,14,32,0.3) 55%, rgba(6,18,40,0.55) 100%)",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
            borderRadius: 999,
            border: `1px solid rgba(200,168,74,0.35)`,
            background: "rgba(200,168,74,0.07)",
            color: goldBright,
            fontSize: 9,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.25em",
            fontWeight: 600,
            textTransform: "uppercase" as const,
            backdropFilter: "blur(10px)",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: gold,
              display: "inline-block",
              boxShadow: `0 0 6px ${gold}`,
            }}
          />
          Available for Opportunities
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "#eef2ff",
            marginBottom: 4,
            textShadow: "0 2px 40px rgba(2,10,26,0.8)",
          }}
        >
          Priastama
        </div>
        <div
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            marginBottom: 30,
            background: `linear-gradient(135deg, ${gold} 0%, ${goldBright} 45%, #f0d890 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 18px rgba(200,168,74,0.5))`,
          }}
        >
          Adiyoga
        </div>

        {/* Slim gold divider */}
        <div
          style={{
            width: 56,
            height: 1,
            background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
            marginBottom: 22,
            opacity: 0.7,
          }}
        />

        {/* Role titles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 18,
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          {["HSE Manager", "OHS Specialist", "AI Orchestrator"].map((role, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: i === 1 ? "#7ab8ff" : "rgba(210,225,255,0.75)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {role}
              </span>
              {i < 2 && (
                <span style={{ color: `rgba(200,168,74,0.4)`, fontSize: 18 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 13,
            fontStyle: "italic",
            color: "rgba(180,200,240,0.45)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            marginBottom: 38,
            maxWidth: 420,
            lineHeight: 1.65,
          }}
        >
          "From mining safety to AI intelligence — where precision meets vision"
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14 }}>
          <button
            style={{
              padding: "13px 34px",
              borderRadius: 4,
              background: `linear-gradient(135deg, ${gold}, ${goldBright})`,
              border: "none",
              color: "#06101e",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: `0 4px 24px rgba(200,168,74,0.35)`,
            }}
          >
            Contact Me →
          </button>
          <button
            style={{
              padding: "13px 34px",
              borderRadius: 4,
              background: "rgba(10,22,40,0.4)",
              border: "1px solid rgba(200,168,74,0.25)",
              color: "rgba(200,215,255,0.65)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            View Experience
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 52,
            marginTop: 56,
            paddingTop: 28,
            borderTop: "1px solid rgba(200,168,74,0.1)",
          }}
        >
          {[
            { v: "8+", l: "Years HSE" },
            { v: "0", l: "LTI Record" },
            { v: "30+", l: "Certifications" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: i === 1 ? "#7ab8ff" : gold,
                  letterSpacing: "-0.02em",
                  textShadow: i === 1
                    ? "0 0 20px rgba(100,180,255,0.4)"
                    : `0 0 20px rgba(200,168,74,0.4)`,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(160,180,220,0.45)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
                  marginTop: 4,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          background: "linear-gradient(to bottom, transparent, #020a1a)",
          pointerEvents: "none",
          zIndex: 11,
        }}
      />

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background: `linear-gradient(to bottom, rgba(200,168,74,0.7), transparent)`,
          }}
        />
      </div>

      {/* Variant label */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          fontSize: 9,
          color: "rgba(200,168,74,0.35)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          zIndex: 12,
        }}
      >
        Variant D — Royal Night
      </div>
    </div>
  );
}
