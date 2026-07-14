import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── Royal Night palette ──────────────────────────────────────────────────────
// Navy:   #020a18 | #04101e | #061228
// Gold:   #c8a84a | #d4b558 | #e8c870
// Blue:   #2a7fff | #4da6ff | #7ab8ff
// Text:   #eef2ff | rgba(210,225,255,0.75)

type Sparkle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; gold: boolean;
};

type Stream = {
  pts: { x: number; y: number }[];
  speed: number; width: number; alpha: number;
  progress: number; color: string;
};

function spawnSparkle(w: number, h: number): Sparkle {
  const zone = Math.random();
  let x: number, y: number;
  if (zone < 0.5) {
    x = Math.random() * w * 0.45;
    y = h * 0.55 + Math.random() * h * 0.45;
  } else if (zone < 0.8) {
    const t = Math.random();
    x = w * 0.1 + t * w * 0.7;
    y = h * 0.8 - t * h * 0.4 + (Math.random() - 0.5) * 60;
  } else {
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
    gold: Math.random() > 0.28,
  };
}

function makeStream(w: number, h: number, isGold: boolean): Stream {
  const startX = Math.random() * w * 0.3;
  const startY = h * 0.7 + Math.random() * h * 0.3;
  const endX = w * 0.6 + Math.random() * w * 0.4;
  const endY = Math.random() * h * 0.4;
  const cp1x = startX + w * 0.15, cp1y = startY - h * 0.2;
  const cp2x = endX - w * 0.2,    cp2y = endY + h * 0.2;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80, mt = 1 - t;
    pts.push({
      x: mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*endX,
      y: mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY,
    });
  }
  return {
    pts,
    speed: 0.003 + Math.random() * 0.005,
    width: isGold ? 0.4 + Math.random() * 1.2 : 0.3 + Math.random() * 0.7,
    alpha: isGold ? 0.32 + Math.random() * 0.42 : 0.14 + Math.random() * 0.22,
    progress: Math.random(),
    color: isGold
      ? `rgba(${200 + Math.random() * 50},${155 + Math.random() * 50},${40 + Math.random() * 40},`
      : `rgba(${42 + Math.random() * 40},${127 + Math.random() * 80},${255},`,
  };
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const sparkles: Sparkle[] = Array.from({ length: 200 }, () => spawnSparkle(W(), H()));
    const streams: Stream[] = [
      ...Array.from({ length: 10 }, () => makeStream(W(), H(), true)),
      ...Array.from({ length: 5  }, () => makeStream(W(), H(), false)),
    ];
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.9,
      a: 0.1 + Math.random() * 0.45,
      tw: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 1.0,
    }));

    let t = 0;

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Ambient navy gradient (adds depth over the photo)
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, 'rgba(2,10,24,0.25)');
      base.addColorStop(0.5, 'rgba(4,16,30,0.15)');
      base.addColorStop(1, 'rgba(6,18,40,0.3)');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Blue atmospheric glow (right side, matching image)
      const blueGlow = ctx.createRadialGradient(w * 0.82, h * 0.28, 0, w * 0.82, h * 0.28, w * 0.45);
      blueGlow.addColorStop(0, 'rgba(42,127,255,0.12)');
      blueGlow.addColorStop(0.4, 'rgba(18,55,160,0.06)');
      blueGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, w, h);

      // Gold warm glow (bottom-left origin of the gold lines)
      const goldGlow = ctx.createRadialGradient(w * 0.18, h * 0.84, 0, w * 0.18, h * 0.84, w * 0.36);
      goldGlow.addColorStop(0, 'rgba(200,168,74,0.12)');
      goldGlow.addColorStop(0.5, 'rgba(160,120,20,0.05)');
      goldGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach(s => {
        const a = s.a * (0.5 + 0.5 * Math.sin(t * s.sp + s.tw));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,225,255,${a})`;
        ctx.fill();
      });

      // Flowing light streams
      streams.forEach(stream => {
        stream.progress = (stream.progress + stream.speed) % 1;
        const tailLen = 0.18;
        const segStart = Math.floor(stream.progress * 80);
        const segEnd   = Math.floor(((stream.progress + tailLen) % 1) * 80);
        const pts = stream.pts;
        if (segEnd > segStart && pts.length > 1) {
          const end = Math.min(segEnd, pts.length - 1);
          ctx.beginPath();
          ctx.moveTo(pts[segStart].x, pts[segStart].y);
          for (let i = segStart + 1; i <= end; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `${stream.color}${stream.alpha * 0.28})`;
          ctx.lineWidth = stream.width * 5;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 12;
          ctx.shadowColor = `${stream.color}0.4)`;
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.moveTo(pts[segStart].x, pts[segStart].y);
          for (let i = segStart + 1; i <= end; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `${stream.color}${stream.alpha})`;
          ctx.lineWidth = stream.width;
          ctx.stroke();

          const hx = pts[end].x, hy = pts[end].y;
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 6);
          hg.addColorStop(0, `${stream.color}0.9)`);
          hg.addColorStop(1, 'transparent');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(hx, hy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Sparkle particles
      sparkles.forEach((sp, idx) => {
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        if (sp.life >= sp.maxLife) { sparkles[idx] = spawnSparkle(w, h); return; }
        const prog  = sp.life / sp.maxLife;
        const alpha = prog < 0.15 ? prog / 0.15 : prog > 0.75 ? (1 - (prog - 0.75) / 0.25) : 1;
        const size  = sp.size * alpha;

        if (sp.gold) {
          const br = 0.6 + 0.4 * Math.sin(t * 3 + sp.life * 0.1);
          const rr = Math.floor(220 + 30 * br), gg = Math.floor(160 + 50 * br), bb = Math.floor(40 + 40 * br);
          const ga = alpha * 0.85;
          const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, size * 4);
          grd.addColorStop(0, `rgba(${rr},${gg},${bb},${ga * 0.45})`);
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.fillRect(sp.x - size * 4, sp.y - size * 4, size * 8, size * 8);
          ctx.save();
          ctx.translate(sp.x, sp.y);
          ctx.rotate(t * 0.5 + sp.life * 0.05);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${ga})`;
          ctx.fillRect(-size * 0.15, -size, size * 0.3, size * 2);
          ctx.fillRect(-size, -size * 0.15, size * 2, size * 0.3);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${ga * 0.5})`;
          ctx.fillRect(-size * 0.1, -size * 0.6, size * 0.2, size * 1.2);
          ctx.fillRect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,210,255,${alpha * 0.55})`;
          ctx.fill();
        }
      });

      // Vignette
      const vig = ctx.createRadialGradient(w * 0.4, h * 0.45, h * 0.08, w * 0.4, h * 0.45, h * 0.82);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(2,8,18,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      t += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">

      {/* ── Layer 0: reference photo background */}
      <img
        src="/photos/royal-night-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        style={{ filter: 'brightness(0.52) saturate(1.1)', zIndex: 0 }}
      />

      {/* ── Layer 1: animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1, mixBlendMode: 'screen' }}
      />

      {/* ── Layer 2: centre-left darkening for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(120deg, rgba(2,10,24,0.62) 0%, rgba(4,14,32,0.28) 55%, rgba(6,18,40,0.5) 100%)',
        }}
      />

      {/* ── Layer 3: bottom fade into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ zIndex: 3, background: 'linear-gradient(to bottom, transparent, #020a18)' }}
      />

      {/* ── Content */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 10 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-7 inline-flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            border: '1px solid rgba(200,168,74,0.32)',
            background: 'rgba(200,168,74,0.07)',
            color: '#e8c870',
            fontSize: 10,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.24em',
            fontWeight: 600,
            textTransform: 'uppercase',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{
              width: 5, height: 5,
              background: '#c8a84a',
              boxShadow: '0 0 7px #c8a84a',
              animation: 'pulse 2.2s ease-in-out infinite',
            }}
          />
          Available for Opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-heading font-bold tracking-tight mb-2"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            lineHeight: 1.06,
            paddingTop: '0.04em',
            color: '#eef2ff',
            textShadow: '0 2px 40px rgba(2,10,24,0.9)',
          }}
        >
          Priastama
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-heading font-bold tracking-tight mb-8"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            lineHeight: 1.14,
            paddingBottom: '0.12em',
            background: 'linear-gradient(135deg, #c8a84a 0%, #e8c870 45%, #f0d890 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(200,168,74,0.45))',
          }}
        >
          Adiyoga
        </motion.div>

        {/* Slim gold divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            width: 56, height: 1, marginBottom: 22,
            background: 'linear-gradient(to right, transparent, #c8a84a, transparent)',
          }}
        />

        {/* Role titles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          {['HSE Manager', 'OHS Specialist', 'AI Orchestrator'].map((role, i) => (
            <span key={i} className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 'clamp(0.85rem, 2vw, 1.2rem)',
                  fontWeight: 400,
                  color: i === 1 ? '#7ab8ff' : 'rgba(210,225,255,0.78)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {role}
              </span>
              {i < 2 && (
                <span style={{ color: 'rgba(200,168,74,0.38)', fontSize: 18 }}>·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-sm md:text-base max-w-md mx-auto mb-12 italic font-light"
          style={{
            color: 'rgba(180,200,240,0.42)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.7,
          }}
        >
          "From mining safety to AI intelligence — where precision meets vision"
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => scrollTo('contact')}
            className="group relative px-9 py-4 rounded-lg font-bold text-xs tracking-widest uppercase overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #c8a84a, #e8c870)',
              color: '#06101e',
              boxShadow: '0 4px 28px rgba(200,168,74,0.32)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Contact Me
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #b8983a, #d4b558)' }}
            />
          </button>
          <button
            onClick={() => scrollTo('experience')}
            className="px-9 py-4 rounded-lg font-semibold text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              border: '1px solid rgba(200,168,74,0.48)',
              background: 'rgba(4,14,30,0.45)',
              color: 'rgba(220,232,255,0.88)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,74,0.13)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,74,0.68)';
              (e.currentTarget as HTMLElement).style.color = '#e8c870';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(4,14,30,0.45)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,74,0.48)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(220,232,255,0.88)';
            }}
          >
            View Experience
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-12"
        >
          {[
            { value: '8+', label: 'Years HSE', blue: false },
            { value: '0',  label: 'LTI Record', blue: true },
            { value: '30+', label: 'Certifications', blue: false },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="font-heading font-bold"
                style={{
                  fontSize: 26,
                  color: s.blue ? '#7ab8ff' : '#c8a84a',
                  textShadow: s.blue
                    ? '0 0 18px rgba(100,180,255,0.5)'
                    : '0 0 18px rgba(200,168,74,0.45)',
                }}
              >
                {s.value}
              </div>
              <div
                className="tracking-widest uppercase"
                style={{ fontSize: 9, color: 'rgba(160,180,220,0.45)', fontFamily: 'Inter, sans-serif', marginTop: 4 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-top"
        style={{ zIndex: 20, width: 1, height: 56, background: 'linear-gradient(to bottom, rgba(200,168,74,0.55), transparent)' }}
      />
    </section>
  );
}
