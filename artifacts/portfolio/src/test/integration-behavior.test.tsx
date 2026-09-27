import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Hero } from '@/components/Hero';
import Home from '@/pages/Home';

function scrollMock() {
  return window.HTMLElement.prototype.scrollIntoView as unknown as ReturnType<
    typeof vi.fn
  >;
}

describe('Hero canvas + CTAs (behavior)', () => {
  const realRandom = Math.random;
  let seq = 0;

  beforeEach(() => {
    // Deterministic pseudo-random cycle covering every spawn zone
    // (<0.5 / <0.8 / else), gold and blue sparkles, and stream phases.
    seq = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      seq += 1;
      return [0.1, 0.45, 0.62, 0.85, 0.2, 0.95, 0.33, 0.7][seq % 8] ?? 0.5;
    });
    Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return this instanceof window.HTMLCanvasElement ? 800 : 0;
      },
    });
    Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return this instanceof window.HTMLCanvasElement ? 600 : 0;
      },
    });
    scrollMock().mockClear();
  });

  afterEach(() => {
    Math.random = realRandom;
    vi.restoreAllMocks();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('runs the full particle pass on wide screens and scrolls via CTAs', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });
    const user = userEvent.setup();
    render(<Home />);

    const canvas = document.querySelector('#hero canvas');
    expect(canvas).not.toBeNull();

    await user.click(
      screen.getByRole('button', { name: /lihat pengalaman hse/i }),
    );
    expect(scrollMock()).toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', { name: /hubungi untuk kebutuhan hse/i }),
    );
    expect(scrollMock()).toHaveBeenCalledTimes(2);
  });

  it('uses the reduced particle budget and skips head-dots on narrow screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    render(<Hero />);
    expect(document.querySelector('#hero canvas')).not.toBeNull();
  });

  it('ages particles past respawn and wraps stream progress over time', () => {
    vi.useFakeTimers();
    try {
      render(<Hero />);
      // ~300 frames: sparkles exceed maxLife (respawn) and streams lap
      // their tails (skip-draw branch), covering every alpha phase.
      for (let i = 0; i < 320; i += 1) {
        vi.advanceTimersByTime(16);
      }
      expect(document.querySelector('#hero canvas')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('handles CTA hover and keyboard focus rings', () => {
    render(<Home />);
    const primary = screen.getByRole('button', {
      name: /lihat pengalaman hse/i,
    });
    fireEvent.mouseEnter(primary);
    fireEvent.focus(primary);
    expect(primary.style.boxShadow).toMatch(/200,168,74/);
    fireEvent.blur(primary);

    const secondary = screen.getByRole('button', {
      name: /hubungi untuk kebutuhan hse/i,
    });
    fireEvent.mouseEnter(secondary);
    expect(secondary.style.color).toBe('rgb(232, 200, 112)');
    fireEvent.mouseLeave(secondary);
    fireEvent.focus(secondary);
    fireEvent.blur(secondary);
    expect(secondary.style.outline).toBe('none');
  });
});

describe('Nav scroll + hover states (behavior)', () => {
  beforeEach(() => {
    scrollMock().mockClear();
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('condenses the bar after scrolling past the threshold', () => {
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    expect(nav.style.backdropFilter).toBe('none');

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 120,
    });
    fireEvent.scroll(window);
    expect(nav.style.backdropFilter).toBe('blur(20px)');
  });

  it('highlights hovered items but never overrides the active one', () => {
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    const buttons = within(nav).getAllByRole('button');
    const inactive = buttons.find(
      (b) => b.textContent !== '' && b.style.color !== 'rgb(200, 168, 74)',
    );
    expect(inactive).toBeDefined();
    fireEvent.mouseEnter(inactive!);
    fireEvent.mouseLeave(inactive!);
  });

  it('ignores non-Escape keys while the drawer is open', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /buka menu navigasi/i }));
    await user.keyboard('a');
    expect(
      screen.getByRole('dialog', { name: /menu navigasi hse/i }),
    ).toBeInTheDocument();
  });

  it('routes drawer Connect to the contact section', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /buka menu navigasi/i }));
    const drawer = screen.getByRole('dialog', { name: /menu navigasi hse/i });
    await user.click(within(drawer).getByRole('button', { name: 'Connect' }));
    expect(scrollMock()).toHaveBeenCalled();
  });

  it('routes desktop Connect and the brand mark', async () => {
    const user = userEvent.setup();
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    await user.click(within(nav).getByRole('button', { name: 'Connect' }));
    await user.click(
      screen.getByRole('button', {
        name: /kembali ke beranda portfolio hse/i,
      }),
    );
    expect(scrollMock()).toHaveBeenCalledTimes(2);
  });

  it('routes desktop nav items to their sections', async () => {
    const user = userEvent.setup();
    render(<Home />);
    const nav = screen.getByRole('navigation', { name: /navigasi utama/i });
    await user.click(within(nav).getByRole('button', { name: 'About' }));
    await user.click(within(nav).getByRole('button', { name: 'Skills' }));
    expect(scrollMock()).toHaveBeenCalledTimes(2);
  });
});

describe('card hover affordances (behavior)', () => {
  it('elevates contact cards with hrefs and leaves the location card flat', () => {
    render(<Home />);
    const mails = screen.getAllByRole('link', {
      name: /kirim email kebutuhan hse dan k3l/i,
    });
    const mail = mails[0];
    if (!mail) throw new Error('expected at least one HSE email link');
    const card = mail.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(card);
    expect(card.style.borderColor).not.toBe('rgba(238, 242, 255, 0.07)');
    fireEvent.mouseLeave(card);
    expect(card.style.borderColor).toBe('rgba(238, 242, 255, 0.07)');
  });

  it('tints skill pills toward their category color on hover', () => {
    render(<Home />);
    const pill = screen.getByText('HIRADC');
    fireEvent.mouseEnter(pill);
    expect(pill.style.color).toBe('rgb(200, 168, 74)');
    fireEvent.mouseLeave(pill);
    expect(pill.style.color).toBe('rgba(216, 228, 252, 0.78)');
  });
});
