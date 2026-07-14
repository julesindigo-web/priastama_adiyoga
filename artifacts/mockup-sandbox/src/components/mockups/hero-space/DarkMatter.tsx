import { useEffect, useRef } from "react";

export function DarkMatter() {
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
    const cx = W * 0.62; // right-side focal point for asymmetric layout
    const cy = H * 0.5;

    // Sparse premium star field
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 0.9,
      alpha: 0.08 + Math.random() * 0.35,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.6,
    }));

    // Fine dust particles
    const dust = Array.from({ length: 30 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 90 + Math.random() * 200,
      speed: (Math.random() - 0.5) * 0.008,
      alpha: 0.04 + Math.random() * 0.18,
      r: 0.4 + Math.random() * 1.2,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Absolute black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Very subtle off-center warm grey gradient
      const ambientGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320);
      ambientGrad.addColorStop(0, "rgba(28,26,24,0.9)");
      ambientGrad.addColorStop(0.6, "rgba(12,11,10,0.6)");
      ambientGrad.addColorStop(1, "transparent");
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, W, H);

      // Sparse stars
      stars.forEach((s) => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,195,185,${a})`;
        ctx.fill();
      });

      // Very faint outer ring glow
      const outerGlow = ctx.createRadialGradient(cx, cy, 155, cx, cy, 230);
      outerGlow.addColorStop(0, "rgba(160,155,145,0.03)");
      outerGlow.addColorStop(0.5, "rgba(120,115,108,0.02)");
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, W, H);

      // Architectural rings — platinum/silver, extremely precise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.06);

      // Outermost ring
      ctx.beginPath();
      ctx.ellipse(0, 0, 185, 52, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,135,125,${0.06 + Math.sin(t * 0.3) * 0.02})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.1);

      // Main platinum ring
      const ringA = 0.25 + Math.sin(t * 0.25) * 0.05;
      ctx.beginPath();
      ctx.ellipse(0, 0, 148, 40, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(190,185,175,${ringA})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Inner glow on ring
      ctx.beginPath();
      ctx.ellipse(0, 0, 148, 40, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220,215,205,${ringA * 0.4})`;
      ctx.lineWidth = 2.5;
      ctx.filter = "blur(2px)";
      ctx.stroke();
      ctx.filter = "none";

      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.14 + Math.PI * 0.3);

      // Inner ring — barely visible
      ctx.beginPath();
      ctx.ellipse(0, 0, 105, 30, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160,155,148,${0.12 + Math.sin(t * 0.4) * 0.04})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();

      // Central void / dark sphere
      const sphereR = 60;
      const sphereGrad = ctx.createRadialGradient(
        cx - sphereR * 0.3, cy - sphereR * 0.35, 0,
        cx, cy, sphereR
      );
      sphereGrad.addColorStop(0, "rgba(22,20,18,0.95)");
      sphereGrad.addColorStop(0.5, "rgba(10,9,8,0.92)");
      sphereGrad.addColorStop(0.85, "rgba(4,3,3,0.88)");
      sphereGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Sphere highlight rim
      const rimGrad = ctx.createRadialGradient(
        cx - sphereR * 0.4, cy - sphereR * 0.45, 0,
        cx, cy, sphereR
      );
      rimGrad.addColorStop(0.55, "transparent");
      rimGrad.addColorStop(0.8, "rgba(180,175,165,0.06)");
      rimGrad.addColorStop(1, "rgba(160,155,145,0.12)");
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(cx - sphereR * 0.3, cy - sphereR * 0.35, sphereR * 0.15, 0, Math.PI * 2);
      const spec = ctx.createRadialGradient(
        cx - sphereR * 0.3, cy - sphereR * 0.35, 0,
        cx - sphereR * 0.3, cy - sphereR * 0.35, sphereR * 0.15
      );
      spec.addColorStop(0, `rgba(235,230,220,${0.15 + Math.sin(t * 0.5) * 0.04})`);
      spec.addColorStop(1, "transparent");
      ctx.fillStyle = spec;
      ctx.fill();

      // Dust particles orbiting
      dust.forEach((d) => {
        d.angle += d.speed;
        const px = cx + Math.cos(d.angle) * d.dist;
        const py = cy + Math.sin(d.angle) * d.dist * 0.28;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,175,165,${d.alpha * (0.7 + 0.3 * Math.sin(t * 2 + d.angle))})`;
        ctx.fill();
      });

      // Horizontal scan line — very subtle
      const scanY = cy + Math.sin(t * 0.4) * H * 0.06;
      const scanGrad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(0.5, "rgba(160,155,145,0.025)");
      scanGrad.addColorStop(1, "transparent");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 1, W, 2);

      // Vignette — heavier for luxury look
      const vig = ctx.createRadialGradient(cx * 0.8, cy, H * 0.15, cx * 0.8, cy, H * 0.8);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.88)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t += 0.009;
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
        background: "#000000",
        display: "flex",
        alignItems: "center",
        fontFamily: "'Syne', 'Inter', sans-serif",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Asymmetric left-aligned content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 0 0 8%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: "52%",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 28,
              height: 1,
              background: "rgba(160,155,145,0.4)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "rgba(150,145,135,0.65)",
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Available for Opportunities
          </span>
        </div>

        {/* Name — ultra large, editorial weight */}
        <div
          style={{
            fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#d8d4cc",
            marginBottom: 0,
          }}
        >
          Priastama
        </div>
        <div
          style={{
            fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            marginBottom: 36,
            background: "linear-gradient(135deg, #9a958a 0%, #d0cbc0 45%, #7a7570 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Adiyoga
        </div>

        {/* Thin rule */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "rgba(140,135,125,0.3)",
            marginBottom: 28,
          }}
        />

        {/* Titles — stacked vertically for editorial feel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 32 }}>
          {["HSE Manager", "OHS Specialist", "AI Orchestrator"].map((title, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: i === 0 ? 20 : i === 1 ? 12 : 8,
                  height: 1,
                  background: `rgba(140,135,125,${0.6 - i * 0.15})`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: `rgba(160,155,145,${0.7 - i * 0.1})`,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {title}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 11,
            fontStyle: "italic",
            color: "rgba(120,115,108,0.5)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            marginBottom: 44,
            maxWidth: 340,
            lineHeight: 1.75,
            letterSpacing: "0.03em",
          }}
        >
          "From mining safety to AI intelligence — where precision meets vision"
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button
            style={{
              padding: "12px 30px",
              borderRadius: 0,
              background: "transparent",
              border: "1px solid rgba(160,155,145,0.35)",
              color: "rgba(190,185,175,0.85)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Contact Me →
          </button>
          <div
            style={{
              width: 1,
              height: 36,
              background: "rgba(130,125,118,0.2)",
            }}
          />
          <button
            style={{
              background: "none",
              border: "none",
              color: "rgba(130,125,118,0.55)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              padding: 0,
            }}
          >
            View Experience
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 56,
          }}
        >
          {[
            { v: "8+", l: "Years HSE" },
            { v: "0", l: "LTI Record" },
            { v: "30+", l: "Certifications" },
          ].map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "rgba(170,165,155,0.8)",
                  letterSpacing: "-0.02em",
                  marginBottom: 2,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  width: 20,
                  height: 1,
                  background: "rgba(130,125,118,0.25)",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(110,105,98,0.5)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  fontFamily: "Inter, sans-serif",
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
          background: "linear-gradient(to bottom, transparent, #000000)",
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
          color: "rgba(110,105,98,0.4)",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        Variant C — Dark Matter
      </div>
    </div>
  );
}
