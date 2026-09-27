import { render, screen } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

import Home from '@/pages/Home';

const ROOT = path.resolve(__dirname, '..', '..');

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

describe('experience claims (regression)', () => {
  it('states 9+ years everywhere and never the retired 8+ figure', () => {
    const sources = [
      read('src/components/Hero.tsx'),
      read('src/components/About.tsx'),
      read('src/components/Achievements.tsx'),
      read('src/components/Contact.tsx'),
      read('index.html'),
      read('public/manifest.json'),
    ];
    for (const src of sources) {
      expect(src).toMatch(/9\+/);
      expect(src).not.toMatch(/8\+/);
    }
    expect(read('public/manifest.json')).toMatch(/9\+ tahun/);
  });

  it('renders the 9+ hero stat with zero-LTI and certification proof points', () => {
    render(<Home />);
    // Hero trio plus the About quad restate the same proof points.
    expect(screen.getAllByText('9+').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Tahun di HSE & K3L').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Lost-Time Incidents').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sertifikasi K3').length).toBeGreaterThanOrEqual(1);
  });

  it('covers coal mining, coal hauling, and andesite mining in the narrative', () => {
    render(<Home />);
    const body = document.body.textContent ?? '';
    expect(body).toMatch(/coal mining/i);
    expect(body).toMatch(/coal hauling/i);
    expect(body).toMatch(/andesite mining/i);
  });

  it('keeps per-role durations honest (6-year site tenure, 30+ certifications)', () => {
    const experience = read('src/components/Experience.tsx');
    expect(experience).toMatch(/6 Tahun/);
    expect(experience).not.toMatch(/9\+ Tahun/);
    render(<Home />);
    expect(screen.getAllByText('30+').length).toBeGreaterThanOrEqual(2);
  });
});
