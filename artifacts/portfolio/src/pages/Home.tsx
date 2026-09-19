import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { Achievements } from '@/components/Achievements';
import { Contact } from '@/components/Contact';
import ThemeProvider from '@/components/ThemeProvider';

export default function Home() {
  return (
    <ThemeProvider>
      <a href="#hero" className="skip-link">
        Lewati ke konten utama
      </a>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
        <Nav />
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Education />
          <Achievements />
          <Contact />
        </main>
      </div>
    </ThemeProvider>
  );
}
