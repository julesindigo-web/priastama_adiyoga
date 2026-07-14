import { motion } from 'framer-motion';

const experiences = [
  {
    company: 'PT. Sungai Berlian Mahakam',
    role: 'HSE Coordinator / SMKP Auditor & Internal Auditor',
    period: 'Jan 2025 – Nov 2025',
    tag: 'Latest',
    tagColor: '#7ab8ff',
    color: '#7ab8ff',
    description: [
      'Developed and upgraded OHS management systems across all IUP areas',
      'Delivered data-driven reporting to MSED Director',
      'Coordinated HSE personnel planning across all IUP operations',
      'Ensured enterprise-wide regulatory compliance with Ministry of Mining standards',
    ],
  },
  {
    company: 'PT. Batara Dharma Persada',
    role: 'Senior Safety Officer',
    period: 'Sep 2024 – Jan 2025',
    tag: null,
    tagColor: '#c8a84a',
    color: '#c8a84a',
    description: [
      'Built complete Safety Management System from inception for Bayan Group Tabang–Senyiur coal hauling project',
      'Maintained incident-free operations in high-risk subcontractor environment',
    ],
  },
  {
    company: 'PT. Aragon Tambang Pratama',
    role: 'Senior HSE Staff',
    period: 'Oct 2023 – Jul 2024',
    tag: 'Zero LTI',
    tagColor: '#4da6ff',
    color: '#c8a84a',
    description: [
      'Designed and deployed complete OHS Management System from zero',
      'Achieved Zero Accident and No LTI for entire project duration',
      'Zero major non-conformances in external audits',
    ],
  },
  {
    company: 'PT. Bara Tabang – Bayan Resources Group',
    role: 'Safety Foreman, Systems & Compliance',
    period: 'Jul 2017 – Jul 2023',
    tag: '6 Years · Award',
    tagColor: '#c8a84a',
    color: '#c8a84a',
    description: [
      'Managed end-to-end safety documentation for one of Indonesia\'s largest coal mining sites',
      'Sustained 100% SOP currency site-wide across 6 years',
      'Built and sustained Zero Accident safety culture across multiple operational cycles',
      '🏆 Honored as Ketua Panitia Terbaik — Bulan K3 Nasional 2023 by PT. Bayan Resources Tabang',
    ],
  },
];

const fieldPhotos = [
  { src: '/photos/mining-inspection.jpg', caption: 'Field Inspection',   sub: 'Mine site HSE audit' },
  { src: '/photos/mining-panorama.jpg',   caption: 'Site Oversight',      sub: 'Operational surveillance' },
  { src: '/photos/mining-work.jpg',       caption: 'Active Operations',   sub: 'Heavy equipment zone' },
];

export function Experience() {
  return (
    <section id="experience" className="py-36 relative overflow-hidden" style={{ background: '#04101e' }}>
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,168,74,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(200,168,74,0.022) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(200,168,74,0.04) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-semibold mb-4 block" style={{ color: '#c8a84a', fontFamily: 'Inter, sans-serif' }}>
            — Career Timeline —
          </span>
          <h2 className="font-heading font-bold tracking-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#eef2ff' }}>
            Professional Trajectory
          </h2>
          <div className="mt-4 mx-auto" style={{ width: 80, height: 2, background: 'linear-gradient(90deg,#c8a84a,#2a7fff)' }} />
        </motion.div>

        {/* Field photo strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-20"
        >
          {fieldPhotos.map((photo, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden cursor-default"
              style={{ aspectRatio: '16/10', border: '1px solid rgba(200,168,74,0.1)' }}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'grayscale(30%) brightness(0.65) saturate(1.1)' }}
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(4,16,30,0.92) 0%, rgba(4,16,30,0.18) 60%, transparent 100%)' }}
              />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(200,168,74,0.5),transparent)' }} />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="font-heading font-semibold text-sm" style={{ color: '#eef2ff' }}>{photo.caption}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(210,225,255,0.42)', fontFamily: 'Inter, sans-serif' }}>{photo.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(200,168,74,0.55), rgba(42,127,255,0.28), transparent)' }}
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="relative pl-20 md:pl-24 group"
              >
                {/* Dot */}
                <div
                  className="absolute left-4 md:left-6 top-6 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#04101e', border: `2px solid ${exp.color}` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: exp.color, boxShadow: `0 0 10px ${exp.color}` }} />
                </div>

                {/* Card */}
                <div
                  className="relative rounded-2xl p-7 overflow-hidden transition-all duration-500 group-hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(238,242,255,0.022)',
                    border: '1px solid rgba(238,242,255,0.07)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to bottom, ${exp.color}, transparent)` }}
                  />
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${exp.color}60, transparent)` }}
                  />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className="font-heading font-bold text-xl leading-tight" style={{ color: '#eef2ff' }}>{exp.company}</h3>
                          {exp.tag && (
                            <span
                              className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                              style={{
                                background: `${exp.tagColor}18`,
                                color: exp.tagColor,
                                border: `1px solid ${exp.tagColor}40`,
                                fontFamily: 'Inter, sans-serif',
                              }}
                            >
                              {exp.tag}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-base" style={{ color: '#7ab8ff', fontFamily: 'Inter, sans-serif' }}>{exp.role}</h4>
                      </div>
                      <div
                        className="text-xs font-mono font-semibold tracking-wider shrink-0 px-3 py-1.5 rounded-lg"
                        style={{
                          background: 'rgba(200,168,74,0.08)',
                          color: '#c8a84a',
                          border: '1px solid rgba(200,168,74,0.2)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {exp.period}
                      </div>
                    </div>

                    <ul className="space-y-2.5">
                      {exp.description.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm leading-relaxed"
                          style={{ color: 'rgba(210,225,255,0.58)', fontFamily: 'Inter, sans-serif' }}
                        >
                          <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ background: exp.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
