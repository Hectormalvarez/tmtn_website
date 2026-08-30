import { describe, it, expect } from 'vitest';
import { aggregateStats } from '@/lib/aggregate-stats';
import { mockRepos, mockAggregateStats } from '../test/fixtures';

describe('aggregateStats', () => {
  it('computes correct totalStars', () => {
    const stats = aggregateStats(mockRepos);
    expect(stats.totalStars).toBe(mockAggregateStats.totalStars);
  });

  it('computes correct totalForks', () => {
    const stats = aggregateStats(mockRepos);
    expect(stats.totalForks).toBe(mockAggregateStats.totalForks);
  });

  it('computes correct totalRepos', () => {
    const stats = aggregateStats(mockRepos);
    expect(stats.totalRepos).toBe(mockAggregateStats.totalRepos);
  });

  it('computes correct mostUsedLanguage', () => {
    const stats = aggregateStats(mockRepos);
    expect(stats.mostUsedLanguage).toBe('Python');
  });

  it('returns null mostUsedLanguage for empty repos', () => {
    const stats = aggregateStats([]);
    expect(stats.mostUsedLanguage).toBeNull();
    expect(stats.totalRepos).toBe(0);
  });

  it('sorts languageDistribution by count descending', () => {
    const stats = aggregateStats(mockRepos);
    const counts = stats.languageDistribution.map((l) => l.count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });
});
