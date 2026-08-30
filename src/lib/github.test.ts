import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRepos, getUserProfile } from '@/lib/github';
import { mockRepos, mockUserProfile } from '../test/fixtures';

// ── Mock fetch ───────────────────────────────────────────────────────────────

const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── getRepos ─────────────────────────────────────────────────────────────────

describe('getRepos', () => {
  it('returns mapped repos on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    } as Response);

    const repos = await getRepos();
    expect(repos).toHaveLength(mockRepos.length);
    expect(repos[0].name).toBe('tmtn_website');
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    const repos = await getRepos();
    expect(repos).toEqual([]);
  });

  it('returns empty array on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 } as Response);
    const repos = await getRepos();
    expect(repos).toEqual([]);
  });

  it('maps new fields (created_at, forks_count, archived)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockRepos[0]],
    } as Response);

    const repos = await getRepos();
    expect(repos[0]).toHaveProperty('created_at');
    expect(repos[0]).toHaveProperty('forks_count');
    expect(repos[0]).toHaveProperty('archived');
  });
});

// ── getUserProfile ───────────────────────────────────────────────────────────

describe('getUserProfile', () => {
  it('returns mapped profile on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserProfile,
    } as Response);

    const profile = await getUserProfile();
    expect(profile).not.toBeNull();
    expect(profile!.login).toBe('Hectormalvarez');
    expect(profile!.public_repos).toBe(25);
    expect(profile!.followers).toBe(12);
    expect(profile!.created_at).toBe('2019-03-15T10:00:00Z');
  });

  it('returns null on 404', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 } as Response);
    const profile = await getUserProfile();
    expect(profile).toBeNull();
  });

  it('returns null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    const profile = await getUserProfile();
    expect(profile).toBeNull();
  });

  it('maps all profile fields correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserProfile,
    } as Response);

    const profile = await getUserProfile();
    expect(profile!.name).toBe('Hector Alvarez');
    expect(profile!.bio).toBe('Systems Automation & IT Support');
    expect(profile!.location).toBe('Texas');
    expect(profile!.company).toBe('taylormadetech.net');
    expect(profile!.blog).toBe('https://taylormadetech.net');
    expect(profile!.html_url).toBe('https://github.com/Hectormalvarez');
    expect(profile!.following).toBe(5);
    expect(profile!.public_gists).toBe(0);
  });
});
