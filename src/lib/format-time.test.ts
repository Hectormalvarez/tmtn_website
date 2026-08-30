import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatRelativeTime } from '@/lib/format-time';

afterEach(() => {
  vi.useRealTimers();
});

describe('formatRelativeTime', () => {
  it('returns "just now" for times less than 60 seconds ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-30T11:59:30Z')).toBe('just now');
  });

  it('returns minutes ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-30T11:57:00Z')).toBe('3 min ago');
  });

  it('returns singular "1 min ago"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-30T11:59:00Z')).toBe('1 min ago');
  });

  it('returns hours ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-30T09:00:00Z')).toBe('3 hours ago');
  });

  it('returns singular "1 hour ago"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-30T11:00:00Z')).toBe('1 hour ago');
  });

  it('returns "yesterday"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-29T12:00:00Z')).toBe('yesterday');
  });

  it('returns days ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-26T12:00:00Z')).toBe('4 days ago');
  });

  it('returns weeks ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-08-16T12:00:00Z')).toBe('2 weeks ago');
  });

  it('returns months ago for dates beyond weeks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2026-05-30T12:00:00Z')).toBe('3 months ago');
  });

  it('returns years ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    expect(formatRelativeTime('2024-08-30T12:00:00Z')).toBe('2 years ago');
  });
});
