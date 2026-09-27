import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';
import Home from '@/pages/Home';
import NotFound from '@/pages/not-found';

const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'skills',
  'education',
  'achievements',
  'contact',
] as const;

const NAV_LABELS = [
  'About',
  'Experience',
  'Skills',
  'Education',
  'Achievements',
  'Contact',
] as const;

describe('App composition (integration)', () => {
  it('renders the full single-page portfolio with every section', () => {
    const { container } = render(<Home />);
    for (const id of SECTION_IDS) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(container.querySelector('#main-content')).not.toBeNull();
  });

  it('exposes exactly one h1 carrying the hero name', () => {
    render(<Home />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/Priastama/);
    expect(headings[0]).toHaveTextContent(/Adiyoga/);
  });

  it('renders the skip link targeting the main content', () => {
    render(<Home />);
    const skip = screen.getByRole('link', { name: /lewati ke konten utama/i });
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('renders desktop navigation with every item plus the Connect CTA', () => {
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    for (const label of NAV_LABELS) {
      expect(
        within(nav).getByRole('button', { name: label }),
      ).toBeInTheDocument();
    }
    expect(
      within(nav).getByRole('button', { name: 'Connect' }),
    ).toBeInTheDocument();
  });

  it('routes unknown paths to the branded 404 page', () => {
    window.history.pushState({}, '', '/rute-yang-tidak-ada');
    render(<App />);
    expect(
      screen.getByRole('heading', { name: '404' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /kembali ke beranda/i }),
    ).toHaveAttribute('href', '/');
    window.history.pushState({}, '', '/');
  });

  it('renders the 404 page standalone with Royal Night voice', () => {
    render(<NotFound />);
    expect(screen.getByText(/halaman tidak ditemukan/i)).toBeInTheDocument();
    expect(screen.getByText(/rute yang anda tuju/i)).toBeInTheDocument();
  });
});
