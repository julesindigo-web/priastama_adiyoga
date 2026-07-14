import { motion } from 'framer-motion';

const categories = [
  {
    title: 'HSE & Safety',
    icon: '⛏',
    color: '#c8a84a',
    gradient: 'linear-gradient(135deg, rgba(200,168,74,0.12) 0%, rgba(200,168,74,0.03) 100%)',
    border: 'rgba(200,168,74,0.22)',
    skills: [
      'Risk Management', 'Incident Investigation', 'OHS Audit & Inspection',
      'OHS Compliance', 'Safety Counseling', 'Emergency Response',
      'Environmental Management', 'HIRADC', 'Behavior Based Safety', 'SMKP',
    ],
  },
  {
    title: 'Technology & AI',
    icon: '🤖',
    color: '#2a7fff',
    gradient: 'linear-gradient(135deg, rgba(42,127,255,0.12) 0%, rgba(42,127,255,0.03) 100%)',
    border: 'rgba(42,127,255,0.22)',
    skills: [
      'AI Project Orchestration', 'Prompt Engineering', 'LLM Workflow Automation',
      'Enterprise AI Deployment', 'AI System Validation', 'AI Scale Coordination',
    ],
  },
  {
    title: 'Regulatory & Legal',
    icon: '⚖',
    color: '#a89fd4',
    gradient: 'linear-gradient(135deg, rgba(168,159,212,0.1) 0%, rgba(168,159,212,0.02) 100%)',
    border: 'rgba(168,159,212,0.18)',
    skills: [
      'Mining Regulatory Compliance', 'Legal Drafting', 'CSMS',
      'Safety Documentation', 'Advocate Professional (PERADI)',
    ],
  },
  {
    title: 'Leadership',
    icon: '🧭',
    color: '#3a9e8a',
    gradient: 'linear-gradient(135deg, rgba(58,158,138,0.1) 0%, rgba(58,158,138,0.02) 100%)',
    border: 'rgba(58,158,138,0.18)',
    skills: [
      'Team Leadership', 'Negotiation', 'Public Speaking',
      'Process Improvement', 'Analytical Problem Solving',
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-36 relative overflow-hidden" style={{ background: '#020a18' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(42,127,255,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block" style={{ color: '#c8a84a', fontFamily: 'Inter, sans-serif' }}>
            — Core Competencies —
          </span>
          <h2 className="font-heading font-bold tracking-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#eef2ff' }}>
            Competency Matrix
          </h2>
          <div className="mt-4 mx-auto" style={{ width: 80, height: 2, background: 'linear-gradient(90deg,#c8a84a,#2a7fff)' }} />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative rounded-2xl p-8 overflow-hidden"
              style={{ background: cat.gradient, border: `1px solid ${cat.border}`, backdropFilter: 'blur(16px)' }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-35 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${cat.color}28, transparent 70%)` }}
              />

              <div className="flex items-center gap-4 mb-7">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}28` }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-heading font-bold text-xl" style={{ color: cat.color }}>
                  {cat.title}
                </h3>
                <div className="ml-auto text-xs font-mono" style={{ color: `${cat.color}70`, fontFamily: 'Inter, sans-serif' }}>
                  {cat.skills.length} skills
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 + j * 0.04 }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-default"
                    style={{
                      background: 'rgba(2,10,24,0.45)',
                      border: '1px solid rgba(210,225,255,0.08)',
                      color: 'rgba(210,225,255,0.65)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = `${cat.color}18`;
                      (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}48`;
                      (e.currentTarget as HTMLElement).style.color = cat.color;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(2,10,24,0.45)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(210,225,255,0.08)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(210,225,255,0.65)';
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
