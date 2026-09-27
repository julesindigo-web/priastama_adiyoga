import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { reducer, toast, useToast } from '@/hooks/use-toast';

describe('toast reducer', () => {
  it('adds a toast and enforces the single-toast limit', () => {
    const one = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', title: 'A' } },
    );
    expect(one.toasts.map((t) => t.id)).toEqual(['1']);

    const two = reducer(one, {
      type: 'ADD_TOAST',
      toast: { id: '2', title: 'B' },
    });
    expect(two.toasts.map((t) => t.id)).toEqual(['2']);
  });

  it('updates the matching toast only', () => {
    const state = reducer(
      { toasts: [{ id: '1', title: 'A' }] },
      { type: 'UPDATE_TOAST', toast: { id: '1', title: 'A2' } },
    );
    expect(state.toasts[0]?.title).toBe('A2');

    const untouched = reducer(
      { toasts: [{ id: '1', title: 'A' }] },
      { type: 'UPDATE_TOAST', toast: { id: '9', title: 'X' } },
    );
    expect(untouched.toasts[0]?.title).toBe('A');
  });

  it('dismisses one toast and queues its removal', () => {
    vi.useFakeTimers();
    try {
      const state = reducer(
        { toasts: [{ id: '1', title: 'A', open: true }] },
        { type: 'DISMISS_TOAST', toastId: '1' },
      );
      expect(state.toasts[0]?.open).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('dismisses every toast when no id is given', () => {
    const state = reducer(
      {
        toasts: [
          { id: '1', title: 'A', open: true },
          { id: '2', title: 'B', open: true },
        ],
      },
      { type: 'DISMISS_TOAST' },
    );
    expect(state.toasts.every((t) => t.open === false)).toBe(true);
  });

  it('removes one toast or clears all', () => {
    const one = reducer(
      {
        toasts: [
          { id: '1', title: 'A' },
          { id: '2', title: 'B' },
        ],
      },
      { type: 'REMOVE_TOAST', toastId: '1' },
    );
    expect(one.toasts.map((t) => t.id)).toEqual(['2']);

    const cleared = reducer(
      { toasts: [{ id: '1', title: 'A' }] },
      { type: 'REMOVE_TOAST' },
    );
    expect(cleared.toasts).toEqual([]);
  });
});

describe('toast() + useToast()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('publishes a toast to subscribers with dismiss/update controls', () => {
    const { result } = renderHook(() => useToast());

    let handle!: ReturnType<typeof toast>;
    act(() => {
      handle = toast({ title: 'HSE' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(typeof handle.dismiss).toBe('function');
    expect(typeof handle.update).toBe('function');

    act(() => {
      handle.dismiss();
    });
    expect(result.current.toasts[0]?.open).toBe(false);

    act(() => {
      handle.update({ ...result.current.toasts[0], id: handle.id, title: 'K3L' });
    });
    expect(result.current.toasts[0]?.title).toBe('K3L');
  });

  it('fires onOpenChange dismiss when a toast closes', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'HSE' });
    });
    const current = result.current.toasts[0];
    act(() => {
      current?.onOpenChange?.(false);
    });
    expect(result.current.toasts[0]?.open).toBe(false);
  });

  it('removes the toast after the dismissal delay', () => {
    const { result } = renderHook(() => useToast());
    let handle!: ReturnType<typeof toast>;
    act(() => {
      handle = toast({ title: 'HSE' });
    });
    act(() => {
      handle.dismiss();
    });
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it('leaves non-matching toasts untouched on targeted dismiss', () => {
    const state = reducer(
      { toasts: [{ id: '2', title: 'B', open: true }] },
      { type: 'DISMISS_TOAST', toastId: '1' },
    );
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]?.open).toBe(true);
  });

  it('dismisses through the hook control and unsubscribes on unmount', () => {
    const { result, unmount } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'HSE' });
    });
    act(() => {
      result.current.dismiss(result.current.toasts[0]?.id);
    });
    expect(result.current.toasts[0]?.open).toBe(false);
    unmount();
    act(() => {
      toast({ title: 'K3L' });
    });
  });

  it('ignores open transitions that keep the toast open', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'HSE' });
    });
    act(() => {
      result.current.toasts[0]?.onOpenChange?.(true);
    });
    expect(result.current.toasts[0]?.open).toBe(true);
  });
});
