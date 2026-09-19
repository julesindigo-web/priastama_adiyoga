import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'About', id: 'about' },
  { name: 'Experience', id: 'experience' },
  { name: 'Skills', id: 'skills' },
  { name: 'Education', id: 'education' },
  { name: 'Achievements', id: 'achievements' },
  { name: 'Contact', id: 'contact' },
];

export function Nav() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        aria-label="Navigasi utama portfolio HSE"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background:    scrolled ? 'rgba(2,10,24,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)'        : 'none',
          borderBottom:  scrolled ? '1px solid rgba(200,168,74,0.1)' : '1px solid transparent',
          padding:       scrolled ? '14px 0' : '22px 0',
        }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            aria-label="Kembali ke beranda portfolio HSE Priastama Adiyoga"
            className="flex items-center gap-2.5 font-heading font-bold text-lg tracking-widest hover:opacity-80 transition-opacity"
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{
                background: 'linear-gradient(135deg, #c8a84a, #e8c870)',
                color: '#06101e',
              }}
            >
              P
            </span>
            <span style={{ color: 'rgba(238,242,255,0.88)' }}>Adiyoga</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.id)}
                className="relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg"
                style={{ color: active === item.id ? '#c8a84a' : 'rgba(210,225,255,0.5)' }}
                onMouseEnter={e => {
                  if (active !== item.id)
                    (e.currentTarget as HTMLElement).style.color = 'rgba(238,242,255,0.9)';
                }}
                onMouseLeave={e => {
                  if (active !== item.id)
                    (e.currentTarget as HTMLElement).style.color = 'rgba(210,225,255,0.5)';
                }}
              >
                {item.name}
                {active === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#c8a84a' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="ml-4 px-5 py-2 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #c8a84a, #e8c870)',
                color: '#06101e',
                boxShadow: '0 2px 16px rgba(200,168,74,0.25)',
              }}
            >
              Connect
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-hse-menu"
            style={{ background: 'rgba(200,168,74,0.07)', border: '1px solid rgba(200,168,74,0.15)' }}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen
              ? <X    size={20} style={{ color: '#c8a84a' }} />
              : <Menu size={20} style={{ color: 'rgba(210,225,255,0.7)' }} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            id="mobile-hse-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi HSE"
            className="fixed top-0 right-0 bottom-0 z-40 w-72 flex flex-col pt-24 px-8 gap-2"
            style={{
              background:    'rgba(2,10,24,0.97)',
              backdropFilter: 'blur(24px)',
              borderLeft:    '1px solid rgba(200,168,74,0.1)',
            }}
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(item.id)}
                className="text-left py-4 text-lg font-heading font-semibold transition-colors border-b"
                style={{
                  color: active === item.id ? '#c8a84a' : 'rgba(210,225,255,0.7)',
                  borderColor: 'rgba(200,168,74,0.08)',
                }}
              >
                {item.name}
              </motion.button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="mt-6 py-4 rounded-xl font-bold text-sm tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #c8a84a, #e8c870)',
                color: '#06101e',
              }}
            >
              Connect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
