import { motion } from 'framer-motion';

const achievements = [
  {
    emoji: '🏆',
    title: 'Best Committee Chair',
    subtitle: 'Ketua Panitia Terbaik · K3N 2023',
    color: '#c8a84a',
    gradient: 'linear-gradient(135deg, rgba(200,168,74,0.14) 0%, rgba(200,168,74,0.03) 100%)',
    border: 'rgba(200,168,74,0.28)',
    photo: '/photos/safety-event.jpg',
    description:
      "Awarded by PT. Bayan Resources Tabang for outstanding leadership of National Workplace Safety Month at one of Indonesia's largest coal mining groups.",
  },
  {
    emoji: '🛡',
    title: 'Zero Accident Record',
    subtitle: '8+ Years · No LTI',
    color: '#2a7fff',
    gradient: 'linear-gradient(135deg, rgba(42,127,255,0.12) 0%, rgba(42,127,255,0.03) 100%)',
    border: 'rgba(42,127,255,0.25)',
    photo: '/photos/mining-panorama.jpg',
    description:
      'Maintained incident-free operations across multiple active mine sites throughout an entire career in high-risk coal mining environments.',
  },
  {
    emoji: '🏗',
    title: '3× Systems Built from Zero',
    subtitle: 'OHS Architecture',
    color: '#a89fd4',
    gradient: 'linear-gradient(135deg, rgba(168,159,212,0.1) 0%, rgba(168,159,212,0.02) 100%)',
    border: 'rgba(168,159,212,0.22)',
    photo: '/photos/mining-inspection.jpg',
    description:
      'Designed, deployed, and sustained complete OHS Management Systems from inception at three different companies — each achieving zero major non-conformances.',
  },
  {
    emoji: '⚡',
    title: 'Cross-Domain Integration',
    subtitle: 'HSE · Legal · AI',
    color: '#3a9e8a',
    gradient: 'linear-gradient(135deg, rgba(58,158,138,0.1) 0%, rgba(58,158,138,0.02) 100%)',
    border: 'rgba(58,158,138,0.22)',
    photo: null,
    description:
      'Pioneering the intersection of heavy industry risk management, legal frameworks, and generative AI workflow orchestration without writing code.',
  },
];

export function Achievements() {
  return (
    <section id="achievements" className="py-36 relative overflow-hidden" style={{ background: '#020a18' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,168,74,0.05) 0%, transparent 60%)' }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block" style={{ color: '#c8a84a', fontFamily: 'Inter, sans-serif' }}>
            — Recognition & Impact —
          </span>
          <h2 className="font-heading font-bold tracking-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#eef2ff' }}>
            Milestones of Impact
          </h2>
          <div className="mt-4 mx-auto" style={{ width: 80, height: 2, background: 'linear-gradient(90deg,#c8a84a,#2a7fff)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-default"
              style={{ border: `1px solid ${item.border}` }}
            >
              {/* Photo bg */}
              {item.photo && (
                <div className="absolute inset-0">
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'grayscale(65%) brightness(0.10) saturate(0.8)' }}
                  />
                </div>
              )}

              {/* Gradient fill */}
              <div
                className="absolute inset-0"
                style={{
                  background: item.photo
                    ? `linear-gradient(135deg, rgba(2,10,24,0.97) 0%, rgba(2,10,24,0.92) 100%)`
                    : item.gradient,
                }}
              />

              {/* Top border glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
              />
              {/* Corner glow */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-25 pointer-events-none transition-opacity duration-500 group-hover:opacity-45"
                style={{ background: `radial-gradient(circle, ${item.color}48 0%, transparent 70%)` }}
              />

              {/* Content */}
              <div className="relative z-10 p-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}32` }}
                >
                  {item.emoji}
                </div>

                <h3 className="font-heading font-bold text-2xl mb-1" style={{ color: '#eef2ff' }}>{item.title}</h3>
                <div
                  className="text-xs font-mono font-semibold tracking-widest uppercase mb-5"
                  style={{ color: item.color, fontFamily: 'Inter, sans-serif' }}
                >
                  {item.subtitle}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(210,225,255,0.62)', fontFamily: 'Inter, sans-serif' }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
