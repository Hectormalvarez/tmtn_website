import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRepos, getUserProfile, getUserEvents } from '@/lib/github';
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

// ── getUserEvents ────────────────────────────────────────────────────────────

describe('getUserEvents', () => {
  it('returns mapped events on success', async () => {
    const events = [
      { id: '1', type: 'PushEvent', actor: { id: 1, login: 'test', display_login: 'test', gravatar_id: '', url: '', avatar_url: '' }, repo: { id: 1, name: 'r', url: '' }, payload: { repository_id: 1, push_id: 1, size: 1, distinct_size: 1, ref: 'main', head: 'abc', before: 'def', commits: [] }, public: true, created_at: '2026-01-01T00:00:00Z' },
      { id: '2', type: 'CreateEvent', actor: { id: 1, login: 'test', display_login: 'test', gravatar_id: '', url: '', avatar_url: '' }, repo: { id: 1, name: 'r', url: '' }, payload: { ref: 'main', ref_type: 'branch', master_branch: 'main', description: null, pusher_type: 'user' }, public: true, created_at: '2026-01-02T00:00:00Z' },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => events } as Response);

    const result = await getUserEvents();
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('PushEvent');
  });

  it('filters out unsupported event types', async () => {
    const events = [
      { id: '1', type: 'PushEvent', actor: { id: 1, login: 't', display_login: 't', gravatar_id: '', url: '', avatar_url: '' }, repo: { id: 1, name: 'r', url: '' }, payload: { repository_id: 1, push_id: 1, size: 1, distinct_size: 1, ref: 'main', head: 'a', before: 'b', commits: [] }, public: true, created_at: '2026-01-01T00:00:00Z' },
      { id: '2', type: 'WatchEvent', actor: { id: 1, login: 't', display_login: 't', gravatar_id: '', url: '', avatar_url: '' }, repo: { id: 1, name: 'r', url: '' }, payload: { action: 'started' }, public: true, created_at: '2026-01-02T00:00:00Z' },
      { id: '3', type: 'ForkEvent', actor: { id: 1, login: 't', display_login: 't', gravatar_id: '', url: '', avatar_url: '' }, repo: { id: 1, name: 'r', url: '' }, payload: { forkee: { id: 2, full_name: 't/r2', html_url: '', description: null } }, public: true, created_at: '2026-01-03T00:00:00Z' },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => events } as Response);

    const result = await getUserEvents();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('PushEvent');
  });

  it('returns empty array on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 } as Response);
    const result = await getUserEvents();
    expect(result).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    const result = await getUserEvents();
    expect(result).toEqual([]);
  });
});
