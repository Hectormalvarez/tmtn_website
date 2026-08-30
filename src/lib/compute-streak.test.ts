import { describe, it, expect } from 'vitest';
import { computeStreak } from '@/lib/compute-streak';
import type { CommitActivityWeek } from '@/lib/github.types';

const DAY = 86400;

function makeWeeks(pattern: Array<{ total: number }>): CommitActivityWeek[] {
  const base = Math.floor(Date.now() / 1000) - 52 * 7 * DAY;
  return pattern.map((p, i) => ({
    days: [0, 0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number, number],
    total: p.total,
    week: base + i * 7 * DAY,
  }));
}

describe('computeStreak', () => {
  it('returns 0 for empty data', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('returns 0 when all weeks have zero commits', () => {
    const weeks = makeWeeks(Array.from({ length: 52 }, () => ({ total: 0 })));
    expect(computeStreak(weeks)).toBe(0);
  });

  it('counts consecutive active weeks from the most recent week', () => {
    const pattern = [
      ...Array.from({ length: 48 }, () => ({ total: 0 })),
      { total: 5 },
      { total: 3 },
      { total: 8 },
      { total: 2 },
    ];
    expect(computeStreak(makeWeeks(pattern))).toBe(4);
  });

  it('stops counting at the first zero-commit gap', () => {
    const pattern = [
      ...Array.from({ length: 44 }, () => ({ total: 0 })),
      { total: 5 }, // week 44
      { total: 3 }, // week 45
      { total: 0 }, // week 46 — gap
      { total: 8 }, // week 47
      { total: 2 }, // week 48
      { total: 1 }, // week 49
    ];
    expect(computeStreak(makeWeeks(pattern))).toBe(3);
  });

  it('counts a single active week as streak of 1', () => {
    const pattern = [
      ...Array.from({ length: 51 }, () => ({ total: 0 })),
      { total: 4 },
    ];
    expect(computeStreak(makeWeeks(pattern))).toBe(1);
  });

  it('counts all 52 weeks as a full streak', () => {
    const pattern = Array.from({ length: 52 }, () => ({ total: 1 }));
    expect(computeStreak(makeWeeks(pattern))).toBe(52);
  });
});
