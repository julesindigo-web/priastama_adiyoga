import { motion } from 'framer-motion';

const certs = [
  { name: 'Ahli K3 Pertambangan (OHS Expert)',         org: 'BNSP',       date: '2023–2026', featured: true },
  { name: 'ISMKP – Mining Safety Management System',   org: 'Geominerba',  date: '2023' },
  { name: 'Mid-Level Operations Supervisor (POM)',      org: 'BNSP',       date: '2024' },
  { name: 'Safety and Environment Training',            org: 'Exagama',    date: '2024' },
  { name: 'OHS Management System',                     org: '', date: '' },
  { name: 'Behavior Based Safety',                     org: '', date: '' },
  { name: 'Incident Investigation',                    org: '', date: '' },
  { name: 'Emergency Response Plan',                   org: '', date: '' },
  { name: 'Contractor Safety Management (CSMS)',        org: '', date: '' },
  { name: 'Environmental Management System',           org: '', date: '' },
];

const degrees = [
  {
    year: '2011–2015',
    title: 'Sarjana Hukum (S.H.)',
    subtitle: 'Bachelor of Law',
    institution: 'Universitas 17 Agustus 1945 Samarinda',
    color: '#c8a84a',
    icon: '🎓',
  },
  {
    year: '2017',
    title: 'Advocate Profession Competency',
    subtitle: 'Professional Certification',
    institution: 'PERADI – Perhimpunan Advokat Indonesia',
    color: '#7ab8ff',
    icon: '⚖',
  },
];

export function Education() {
  return (
    <section id="education" className="py-36 relative overflow-hidden" style={{ background: '#04101e' }}>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(42,127,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(42,127,255,0.022) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(42,127,255,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block" style={{ color: '#7ab8ff', fontFamily: 'Inter, sans-serif' }}>
            — Academic & Professional —
          </span>
          <h2 className="font-heading font-bold tracking-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#eef2ff' }}>
            Credentials & Education
          </h2>
          <div className="mt-4 mx-auto" style={{ width: 80, height: 2, background: 'linear-gradient(90deg,#c8a84a,#2a7fff)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Degrees */}
          <div className="lg:col-span-5 space-y-5">
            <h3
              className="text-xs tracking-[0.25em] uppercase font-semibold mb-8"
              style={{ color: 'rgba(210,225,255,0.3)', fontFamily: 'Inter, sans-serif' }}
            >
              Academic Background
            </h3>

            {degrees.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="group relative rounded-2xl p-7 overflow-hidden"
                style={{
                  background: 'rgba(238,242,255,0.025)',
                  border: `1px solid ${d.color}25`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 0%, ${d.color}12 0%, transparent 60%)` }}
                />
                <div className="relative z-10 flex gap-5 items-start">
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: `${d.color}14`, border: `1px solid ${d.color}28` }}
                  >
                    {d.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold mb-1" style={{ color: d.color }}>{d.year}</div>
                    <h4 className="font-heading font-bold text-lg leading-snug" style={{ color: '#eef2ff' }}>{d.title}</h4>
                    <div className="text-xs mb-2" style={{ color: d.color + 'aa', fontFamily: 'Inter, sans-serif' }}>{d.subtitle}</div>
                    <p className="text-sm" style={{ color: 'rgba(210,225,255,0.48)', fontFamily: 'Inter, sans-serif' }}>{d.institution}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* 30+ badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-7 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(200,168,74,0.1), rgba(42,127,255,0.05))',
                border: '1px solid rgba(200,168,74,0.2)',
              }}
            >
              <div className="font-heading font-bold text-5xl mb-2" style={{ color: '#c8a84a', lineHeight: 1.1, paddingTop: '0.04em' }}>30+</div>
              <div
                className="text-sm tracking-widest uppercase font-semibold"
                style={{ color: 'rgba(210,225,255,0.42)', fontFamily: 'Inter, sans-serif' }}
              >
                Professional Certifications
              </div>
            </motion.div>
          </div>

          {/* Certs */}
          <div className="lg:col-span-7">
            <h3
              className="text-xs tracking-[0.25em] uppercase font-semibold mb-8"
              style={{ color: 'rgba(210,225,255,0.3)', fontFamily: 'Inter, sans-serif' }}
            >
              Key Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certs.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group relative rounded-xl p-5 overflow-hidden transition-all duration-300 cursor-default"
                  style={{
                    background: cert.featured ? 'rgba(200,168,74,0.07)' : 'rgba(238,242,255,0.02)',
                    border: cert.featured ? '1px solid rgba(200,168,74,0.32)' : '1px solid rgba(238,242,255,0.06)',
                  }}
                >
                  {cert.featured && (
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(200,168,74,0.75),transparent)' }}
                    />
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
                    style={{ background: 'rgba(238,242,255,0.02)' }}
                  />
                  <div className="relative z-10">
                    {cert.featured && (
                      <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#c8a84a', fontFamily: 'Inter, sans-serif' }}>
                        ★ Featured
                      </div>
                    )}
                    <h4
                      className="font-semibold text-sm leading-snug mb-2"
                      style={{ color: cert.featured ? '#e8c870' : 'rgba(238,242,255,0.82)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {cert.name}
                    </h4>
                    {(cert.org || cert.date) && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(210,225,255,0.32)', fontFamily: 'Inter, sans-serif' }}>
                        {cert.org && <span>{cert.org}</span>}
                        {cert.org && cert.date && <span>·</span>}
                        {cert.date && <span>{cert.date}</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div
              className="mt-5 text-center text-xs tracking-widest uppercase font-semibold"
              style={{ color: 'rgba(210,225,255,0.18)', fontFamily: 'Inter, sans-serif' }}
            >
              + 20 additional specialized HSE certifications
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
