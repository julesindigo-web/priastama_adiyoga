import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Isolated DOM per test (vitest runs with globals disabled, so wire the
// Testing Library auto-cleanup explicitly).
afterEach(() => {
  cleanup();
});

// jsdom lacks requestAnimationFrame; framer-motion and the Hero canvas loop
// need it. The stub runs one frame per call (no auto-loop) so canvas draw()
// executes exactly once per mount — deterministic and leak-free.
if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
  let nextId = 0;
  const pending = new Map<number, ReturnType<typeof setTimeout>>();
  window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    nextId += 1;
    const id = nextId;
    pending.set(
      id,
      setTimeout(() => {
        pending.delete(id);
        cb(performance.now());
      }, 16),
    );
    return id;
  };
  window.cancelAnimationFrame = (handle: number): void => {
    const t = pending.get(handle);
    if (t) {
      clearTimeout(t);
      pending.delete(handle);
    }
  };
}

// use-mobile + framer-motion reduced-motion checks.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => false,
  }),
});

// Nav active-section tracking. Reports every observed section as intersecting
// so whileInView/animate paths execute deterministically in tests.
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
  }
  observe = (target: Element): void => {
    this.cb(
      [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  };
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = (): IntersectionObserverEntry[] => [];
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// Hero canvas ResizeObserver.
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// Nav/Hero smooth scrolling.
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Hero particle layer. jsdom canvas has no 2D implementation; the stub
// records calls so one full draw() pass executes without a real GPU.
function makeGradientStub() {
  return { addColorStop: vi.fn() };
}
function makeContext2DStub() {
  return {
    canvas: null,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt' as CanvasLineCap,
    shadowBlur: 0,
    shadowColor: '#000',
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    restore: vi.fn(),
    createLinearGradient: vi.fn(() => makeGradientStub()),
    createRadialGradient: vi.fn(() => makeGradientStub()),
  };
}
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => makeContext2DStub()),
  configurable: true,
});
