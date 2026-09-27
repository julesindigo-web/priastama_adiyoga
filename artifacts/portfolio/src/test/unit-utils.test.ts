import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges string classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('resolves conflicting tailwind classes with the last winning', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('ignores falsy conditional classes', () => {
    expect(cn('rounded-xl', false && 'hidden', undefined, 'p-4')).toBe(
      'rounded-xl p-4',
    );
  });

  it('supports object and array forms', () => {
    expect(cn({ 'font-bold': true, 'opacity-50': false })).toBe('font-bold');
    expect(cn(['grid', ['gap-4']])).toBe('grid gap-4');
  });
});
