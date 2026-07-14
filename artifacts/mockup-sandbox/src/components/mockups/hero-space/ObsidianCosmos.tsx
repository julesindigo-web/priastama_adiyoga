import { useEffect, useRef } from "react";

export function ObsidianCosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Stars
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4,
      alpha: 0.2 + Math.random() * 0.8,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#0d0d18");
      bg.addColorStop(0.4, "#06060f");
      bg.addColorStop(1, "#020205");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle nebula cloud
      const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
      neb.addColorStop(0, "rgba(80,80,130,0.08)");
      neb.addColorStop(0.5, "rgba(40,40,80,0.05)");
      neb.addColorStop(1, "transparent");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, W, H);

      // Stars
      stars.forEach((s) => {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,225,255,${a})`;
        ctx.fill();
      });

      // Orbiting rings - silver/platinum
      const rings = [
        { r: 115, w: 0.8, a: 0.25, speed: 0.18, tilt: 0.3, color: "rgba(200,210,230," },
        { r: 155, w: 0.5, a: 0.15, speed: -0.12, tilt: 0.7, color: "rgba(180,190,215," },
        { r: 195, w: 0.3, a: 0.1, speed: 0.08, tilt: 1.1, color: "rgba(160,175,200," },
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * ring.speed);
        ctx.scale(1, Math.abs(Math.sin(ring.tilt)));
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.r, ring.r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}${ring.a})`;
        ctx.lineWidth = ring.w;
        ctx.stroke();
        ctx.restore();
      });

      // Central crystal glow
      const crystalGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      crystalGlow.addColorStop(0, "rgba(210,220,255,0.18)");
      crystalGlow.addColorStop(0.4, "rgba(150,160,200,0.07)");
      crystalGlow.addColorStop(1, "transparent");
      ctx.fillStyle = crystalGlow;
      ctx.fillRect(0, 0, W, H);

      // Rotating crystalline octahedron (diamond) - CSS-driven via canvas
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.15);

      const size = 52;
      const verts = [
        [0, -size],       // top
        [size * 0.7, 0],  // right
        [0, size],        // bottom
        [-size * 0.7, 0], // left
      ];

      // Draw crystal facets
      const facets = [
        [verts[0], verts[1], verts[2]],
        [verts[0], verts[3], verts[2]],
      ];

      facets.forEach(([a, b, c], fi) => {
        const grad = ctx.createLinearGradient(a[0], a[1], c[0], c[1]);
        if (fi === 0) {
          grad.addColorStop(0, "rgba(240,245,255,0.55)");
          grad.addColorStop(0.5, "rgba(180,190,220,0.25)");
          grad.addColorStop(1, "rgba(120,135,170,0.35)");
        } else {
          grad.addColorStop(0, "rgba(200,210,240,0.3)");
          grad.addColorStop(0.5, "rgba(140,155,195,0.15)");
          grad.addColorStop(1, "rgba(90,105,145,0.25)");
        }
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(220,230,255,0.4)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      // Inner crystal highlight
      const highlightGrad = ctx.createLinearGradient(-20, -size * 0.6, 20, size * 0.6);
      highlightGrad.addColorStop(0, "rgba(255,255,255,0.6)");
      highlightGrad.addColorStop(0.3, "rgba(255,255,255,0.1)");
      highlightGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.9);
      ctx.lineTo(size * 0.25, 0);
      ctx.lineTo(0, size * 0.5);
      ctx.lineTo(-size * 0.18, 0);
      ctx.closePath();
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      ctx.restore();

      // Floating silver dust particles
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const dist = 80 + Math.sin(t * 0.7 + i) * 20;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.4;
        const pa = 0.3 + Math.sin(t * 1.2 + i) * 0.2;
        const pr = 0.8 + Math.sin(t + i * 1.3) * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,220,255,${pa})`;
        ctx.fill();
      }

      // Vignette
      const vig = ctx.createRadialGradient(cx, cy, H * 0.25, cx, cy, H * 0.75);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(2,2,5,0.75)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const badge = {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    gap: 8,
    padding: "6px 16px",
    borderRadius: 999,
    border: "1px solid rgba(200,210,240,0.25)",
    background: "rgba(200,210,240,0.05)",
    color: "rgba(200,215,255,0.7)",
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    letterSpacing: "0.22em",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    backdropFilter: "blur(8px)",
    marginBottom: 28,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#020205",
        fontFamily: "'Syne', 'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Badge */}
        <div style={badge}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(200,215,255,0.8)",
              animation: "pulse 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          Available for Opportunities
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "clamp(3rem, 7vw, 6.5rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#f0f2ff",
            marginBottom: 6,
          }}
        >
          Priastama
        </div>
        <div
          style={{
            fontSize: "clamp(3rem, 7vw, 6.5rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            marginBottom: 32,
            background: "linear-gradient(135deg, #c8d0e8 0%, #e8edf8 40%, #a0aec8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Adiyoga
        </div>

        {/* Titles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          {["HSE Manager", "OHS Specialist", "AI Orchestrator"].map((t, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "rgba(180,190,220,0.8)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {t}
              </span>
              {i < 2 && (
                <span style={{ color: "rgba(150,165,200,0.3)", fontSize: 18 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 13,
            fontStyle: "italic",
            color: "rgba(160,175,215,0.45)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            marginBottom: 40,
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          "From mining safety to AI intelligence — where precision meets vision"
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14 }}>
          <button
            style={{
              padding: "13px 32px",
              borderRadius: 4,
              background: "rgba(200,215,255,0.12)",
              border: "1px solid rgba(200,215,255,0.35)",
              color: "#e0e8ff",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Contact Me →
          </button>
          <button
            style={{
              padding: "13px 32px",
              borderRadius: 4,
              background: "transparent",
              border: "1px solid rgba(150,165,200,0.2)",
              color: "rgba(170,185,220,0.6)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
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
            gap: 48,
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid rgba(180,190,230,0.08)",
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
                  color: i === 1 ? "rgba(180,195,230,0.9)" : "rgba(200,215,255,0.8)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(140,155,190,0.5)",
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
          height: 120,
          background: "linear-gradient(to bottom, transparent, #020205)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Variant label */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          fontSize: 9,
          color: "rgba(150,165,200,0.4)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        Variant A — Obsidian Cosmos
      </div>
    </div>
  );
}
