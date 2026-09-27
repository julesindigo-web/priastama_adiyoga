import { act, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ThemeProvider from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe('useIsMobile', () => {
  it('reports desktop on wide viewports', () => {
    setViewport(1280);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('reports mobile on narrow viewports and follows resize events', () => {
    setViewport(500);
    const listeners = new Map<string, () => void>();
    const addEventListener = vi.fn((event: string, cb: () => void) => {
      listeners.set(event, cb);
    });
    const removeEventListener = vi.fn();
    window.matchMedia = (() => ({
      matches: true,
      media: '(max-width: 767px)',
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    const { result, unmount } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      setViewport(1280);
      listeners.get('change')?.();
    });
    expect(result.current).toBe(false);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});

describe('ThemeProvider', () => {
  it('forces the Royal Night dark theme with dark color scheme', () => {
    document.documentElement.classList.remove('dark');
    render(
      <ThemeProvider>
        <p>child</p>
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
