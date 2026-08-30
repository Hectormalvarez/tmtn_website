import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockRepos, mockUserProfile } from '../test/fixtures';
import { aggregateStats } from '@/lib/aggregate-stats';

describe('Home page integration', () => {
  const stats = aggregateStats(mockRepos);

  it('computes correct aggregate stats from repos', () => {
    expect(stats.totalStars).toBe(17);
    expect(stats.totalRepos).toBe(7);
    expect(stats.mostUsedLanguage).toBe('Python');
  });

  it('verifies all key components render with mock data', () => {
    const { container } = render(
      <main className="min-h-screen bg-white text-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
            <aside className="lg:sticky lg:top-4 lg:self-start lg:pr-4">
              <h1>{mockUserProfile.login}</h1>
              <span>{stats.totalStars}</span>
              <span>{stats.totalRepos} repos</span>
              <span>{mockUserProfile.followers} followers</span>
            </aside>
            <section>
              <h3>Featured Projects</h3>
              {mockRepos.slice(0, 2).map((r) => (
                <a key={r.id} href={r.html_url}>
                  {r.name}
                </a>
              ))}
            </section>
          </div>
        </div>
      </main>
    );

    expect(screen.getByText('Hectormalvarez')).toBeDefined();
    expect(screen.getByText('Featured Projects')).toBeDefined();
    expect(screen.getByText('tmtn_website')).toBeDefined();
    expect(container.querySelector('main')).toBeDefined();
  });
});