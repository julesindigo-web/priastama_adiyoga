import { render, screen } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

import Home from '@/pages/Home';

const ROOT = path.resolve(__dirname, '..', '..');

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

describe('brand lockup (regression)', () => {
  it('uses the real PA artwork in the nav, blended and sized exactly', () => {
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    const mark = nav.querySelector(
      'img[src="/brand-pa-nav.png"]',
    ) as HTMLImageElement | null;
    expect(mark).not.toBeNull();
    expect(mark?.width).toBe(62);
    expect(mark?.height).toBe(38);
    expect(mark?.style.mixBlendMode).toBe('screen');
  });

  it('carries no separate text label next to the mark', () => {
    render(<Home />);
    const brand = screen.getByRole('button', {
      name: /kembali ke beranda portfolio hse/i,
    });
    expect(brand.textContent?.trim() ?? '').toBe('');
  });

  it('ships the wired brand assets on disk', () => {
    expect(
      fs.existsSync(path.join(ROOT, 'public/brand-pa-nav.png')),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.resolve(__dirname, '..', '..', '..', '..', 'attached_assets/brand-pa-lockup.png'),
      ),
    ).toBe(true);
  });
});

describe('hero typography (regression)', () => {
  it('sets the name in the elegant display face with descender-safe geometry', () => {
    const hero = read('src/components/Hero.tsx');
    expect(hero).toMatch(/font-display/);
    expect(hero).toMatch(/Cormorant|fontStyle: 'italic'/);
    expect(hero).toMatch(/overflow: 'visible'/);
    expect(hero).toMatch(/lineHeight: 1\.22/);
  });

  it('renders the gold gradient name without clipping wrappers', () => {
    render(<Home />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.className).toMatch(/font-display/);
    expect(h1).toHaveTextContent(/Adiyoga/);
  });
});

describe('design system (regression)', () => {
  it('keeps the Royal Night tokens and display-face wiring in CSS', () => {
    const css = read('src/index.css');
    expect(css).toMatch(/--background: 220 82% 6%/);
    expect(css).toMatch(/#c8a84a/);
    expect(css).toMatch(/#2a7fff/);
    expect(css).toMatch(/--font-display: 'Cormorant Garamond'/);
  });

  it('keeps every section header on the shared label + divider rhythm', () => {
    const files = [
      'src/components/About.tsx',
      'src/components/Experience.tsx',
      'src/components/Skills.tsx',
      'src/components/Education.tsx',
      'src/components/Achievements.tsx',
      'src/components/Contact.tsx',
    ];
    for (const file of files) {
      const src = read(file);
      expect(src).toMatch(/tracking-\[0\.3em\]/);
      expect(src).toMatch(/width: 80, height: 2/);
      expect(src).toMatch(/mb-24 text-center/);
    }
  });

  it('gives every meaningful image a description and lazy loading', () => {
    render(<Home />);
    const meaningful = Array.from(
      document.querySelectorAll('main img'),
    ).filter((img) => img.getAttribute('alt') !== '');
    expect(meaningful.length).toBeGreaterThan(0);
    for (const img of meaningful) {
      expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(8);
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });
});
