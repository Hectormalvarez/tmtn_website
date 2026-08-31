import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepoCard } from '@/components/repo-card';
import { mockRepos } from '../test/fixtures';
import type { Repo } from '@/lib/github.types';

afterEach(() => {
  vi.useRealTimers();
});

const staleRepo: Repo = {
  ...mockRepos[1], // humblelibrarysync — 180 days old
};

const freshRepo: Repo = {
  ...mockRepos[0], // tmtn_website — 2 days old
};

const repoWithHomepage: Repo = {
  ...mockRepos[4], // genwords — has homepage
};

const archivedRepo: Repo = {
  ...mockRepos[3], // basic-ad — archived
};

const repoNoHomepage: Repo = {
  ...mockRepos[1], // humblelibrarysync — homepage is null
};

describe('RepoCard', () => {
  it('renders repo name', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.getByText('tmtn_website')).toBeDefined();
  });

  it('renders description when present', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.getByText(/Personal portfolio site/)).toBeDefined();
  });

  it('renders star count', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.getByText(/★/)).toBeDefined();
    expect(screen.getByText(/5/)).toBeDefined();
  });

  it('renders relative timestamp', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-30T12:00:00Z'));
    render(<RepoCard repo={freshRepo} isStale={false} />);
    // pushed_at is ~2 days before fixture creation — should show a time label
    const timestamp = screen.getByText(/ago|yesterday|just now/);
    expect(timestamp).toBeDefined();
  });

  it('renders stale badge when isStale is true', () => {
    render(<RepoCard repo={staleRepo} isStale={true} />);
    expect(screen.getByText('stale')).toBeDefined();
  });

  it('does not render stale badge when isStale is false', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.queryByText('stale')).toBeNull();
  });

  it('renders homepage link when present', () => {
    render(<RepoCard repo={repoWithHomepage} isStale={false} />);
    expect(screen.getByText('Live')).toBeDefined();
  });

  it('does not render homepage link when null', () => {
    render(<RepoCard repo={repoNoHomepage} isStale={false} />);
    expect(screen.queryByText('Live')).toBeNull();
  });

  it('renders archived badge when archived', () => {
    render(<RepoCard repo={archivedRepo} isStale={false} />);
    expect(screen.getByText('archived')).toBeDefined();
  });

  it('does not render archived badge when not archived', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.queryByText('archived')).toBeNull();
  });

  it('renders topic chips when topics exist', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    expect(screen.getByText('nextjs')).toBeDefined();
    expect(screen.getByText('portfolio')).toBeDefined();
  });

  it('links to the repo html_url', () => {
    render(<RepoCard repo={freshRepo} isStale={false} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://github.com/Hectormalvarez/tmtn_website');
  });
});
