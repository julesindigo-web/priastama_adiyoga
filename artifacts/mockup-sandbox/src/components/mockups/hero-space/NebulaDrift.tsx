import { useEffect, useRef } from "react";

export function NebulaDrift() {
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

    // Star field
    const stars = Array.from({ length: 500 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2,
      alpha: 0.15 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.9,
    }));

    // Drifting nebula particles
    const nebParticles = Array.from({ length: 80 }, () => ({
      x: cx + (Math.random() - 0.5) * 400,
      y: cy + (Math.random() - 0.5) * 300,
      r: 40 + Math.random() * 120,
      alpha: 0.015 + Math.random() * 0.04,
      color: Math.random() > 0.5
        ? `rgba(80,100,160,`
        : Math.random() > 0.5
          ? `rgba(60,75,130,`
          : `rgba(100,80,150,`,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep space base
      ctx.fillStyle = "#030309";
      ctx.fillRect(0, 0, W, H);

      // Drift nebula blobs
      nebParticles.forEach((p) => {
        const drift = Math.sin(t * 0.08 + p.phase) * 0.5;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(t * 0.05 + p.phase));
        const grad = ctx.createRadialGradient(
          p.x + drift * 20, p.y + drift * 10, 0,
          p.x + drift * 20, p.y + drift * 10, p.r
        );
        grad.addColorStop(0, `${p.color}${alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      // Stars
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,228,255,${a})`;
        ctx.fill();
      });

      // Subtle constellation lines between some stars
      const constellationStars = stars.slice(0, 12);
      ctx.strokeStyle = "rgba(140,160,220,0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < constellationStars.length - 1; i += 2) {
        const a = constellationStars[i];
        const b = constellationStars[i + 1];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Central atmospheric orb / planet effect
      const orbR = 72;

      // Outer atmospheric glow (layered)
      [160, 120, 90].forEach((glowR, gi) => {
        const glowAlpha = [0.05, 0.08, 0.12][gi];
        const glowColor = ["rgba(80,100,180,", "rgba(60,80,150,", "rgba(100,120,190,"][gi];
        const glow = ctx.createRadialGradient(cx, cy, orbR * 0.5, cx, cy, glowR);
        glow.addColorStop(0, `${glowColor}${glowAlpha})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      });

      // Planet body
      const planetGrad = ctx.createRadialGradient(
        cx - orbR * 0.25, cy - orbR * 0.3, 0,
        cx, cy, orbR
      );
      planetGrad.addColorStop(0, "rgba(90,105,155,0.65)");
      planetGrad.addColorStop(0.4, "rgba(55,70,115,0.5)");
      planetGrad.addColorStop(0.75, "rgba(30,40,80,0.4)");
      planetGrad.addColorStop(1, "rgba(15,20,50,0.2)");
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = planetGrad;
      ctx.fill();

      // Planet highlight
      const highlight = ctx.createRadialGradient(
        cx - orbR * 0.35, cy - orbR * 0.4, 0,
        cx - orbR * 0.1, cy - orbR * 0.15, orbR * 0.6
      );
      highlight.addColorStop(0, "rgba(200,215,255,0.12)");
      highlight.addColorStop(0.5, "rgba(150,170,230,0.04)");
      highlight.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      // Planet ring system
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.08);

      const ringDefs = [
        { rx: 110, ry: 20, w: 0.6, a: 0.18, color: "rgba(130,150,200," },
        { rx: 138, ry: 25, w: 0.4, a: 0.11, color: "rgba(110,130,180," },
        { rx: 168, ry: 30, w: 0.3, a: 0.07, color: "rgba(90,110,160," },
      ];

      ringDefs.forEach((ring) => {
        // Back half
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}${ring.a * 0.5})`;
        ctx.lineWidth = ring.w;
        ctx.stroke();
        // Front half (over planet)
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI);
        ctx.strokeStyle = `${ring.color}${ring.a})`;
        ctx.lineWidth = ring.w;
        ctx.stroke();
      });

      ctx.restore();

      // Floating space dust
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.2 + i * 0.5;
        const dist = 130 + Math.sin(t * 0.5 + i * 0.9) * 30;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.5;
        const pa = 0.25 + Math.sin(t * 0.9 + i) * 0.15;
        ctx.beginPath();
        ctx.arc(px, py, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${pa})`;
        ctx.fill();
      }

      // Vignette
      const vig = ctx.createRadialGradient(cx, cy, H * 0.2, cx, cy, H * 0.75);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(3,3,9,0.8)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t += 0.01;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#030309",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne', 'Inter', sans-serif",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

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
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 2,
            border: "1px solid rgba(130,155,210,0.3)",
            background: "rgba(80,100,170,0.08)",
            color: "rgba(160,180,230,0.75)",
            fontSize: 9,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.25em",
            fontWeight: 600,
            textTransform: "uppercase" as const,
            marginBottom: 30,
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(140,170,240,0.9)",
              display: "inline-block",
            }}
          />
          Available for Opportunities
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "#dde4f8",
            marginBottom: 4,
          }}
        >
          Priastama
        </div>
        <div
          style={{
            fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            marginBottom: 28,
            background: "linear-gradient(135deg, #8fa8d8 0%, #c4d0ee 50%, #7090c0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Adiyoga
        </div>

        {/* Divider */}
        <div
          style={{
            width: 40,
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(130,155,210,0.5), transparent)",
            marginBottom: 22,
          }}
        />

        {/* Titles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          {["HSE Manager", "OHS Specialist", "AI Orchestrator"].map((title, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(160,180,230,0.75)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {title}
              </span>
              {i < 2 && (
                <span style={{ color: "rgba(100,120,180,0.3)", fontSize: 6 }}>◆</span>
              )}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 12,
            fontStyle: "italic",
            color: "rgba(130,150,200,0.4)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            marginBottom: 36,
            maxWidth: 380,
            lineHeight: 1.7,
            letterSpacing: "0.02em",
          }}
        >
          "From mining safety to AI intelligence — where precision meets vision"
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "12px 28px",
              borderRadius: 2,
              background: "rgba(100,130,200,0.15)",
              border: "1px solid rgba(130,155,220,0.4)",
              color: "#c0d0f0",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Contact Me →
          </button>
          <button
            style={{
              padding: "12px 28px",
              borderRadius: 2,
              background: "transparent",
              border: "1px solid rgba(90,110,165,0.2)",
              color: "rgba(130,155,210,0.55)",
              fontSize: 10,
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
            gap: 44,
            marginTop: 52,
            paddingTop: 28,
            borderTop: "1px solid rgba(100,130,200,0.08)",
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
                  fontSize: 24,
                  fontWeight: 700,
                  color: "rgba(160,185,240,0.85)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(110,135,190,0.45)",
                  letterSpacing: "0.22em",
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
          height: 100,
          background: "linear-gradient(to bottom, transparent, #030309)",
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
          color: "rgba(110,135,190,0.4)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        Variant B — Nebula Drift
      </div>
    </div>
  );
}
