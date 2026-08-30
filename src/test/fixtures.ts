import type {
  Repo,
  UserProfile,
  GitHubEvent,
  CommitActivityWeek,
  AggregateStats,
} from '@/lib/github.types';

// ── Shared Actor / Repo ──────────────────────────────────────────────────────

const mockActor = {
  id: 12345,
  login: 'Hectormalvarez',
  display_login: 'Hectormalvarez',
  gravatar_id: '',
  url: 'https://api.github.com/users/Hectormalvarez',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
};

const mockRepo1 = { id: 100, name: 'tmtn_website', url: 'https://api.github.com/repos/Hectormalvarez/tmtn_website' };
const mockRepo2 = { id: 101, name: 'humblelibrarysync', url: 'https://api.github.com/repos/Hectormalvarez/humblelibrarysync' };
const mockRepo3 = { id: 102, name: 'laphost', url: 'https://api.github.com/repos/Hectormalvarez/laphost' };

// ── UserProfile ──────────────────────────────────────────────────────────────

export const mockUserProfile: UserProfile = {
  login: 'Hectormalvarez',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
  html_url: 'https://github.com/Hectormalvarez',
  name: 'Hector Alvarez',
  bio: 'Systems Automation & IT Support',
  location: 'Texas',
  company: 'taylormadetech.net',
  blog: 'https://taylormadetech.net',
  hireable: null,
  twitter_username: null,
  public_repos: 25,
  public_gists: 0,
  followers: 12,
  following: 5,
  created_at: '2019-03-15T10:00:00Z',
};

// ── Repos ────────────────────────────────────────────────────────────────────

const now = Math.floor(Date.now() / 1000);
const DAY = 86400;

export const mockRepos: Repo[] = [
  {
    id: 100, name: 'tmtn_website',
    description: 'Personal portfolio site built with Next.js',
    html_url: 'https://github.com/Hectormalvarez/tmtn_website',
    language: 'TypeScript', topics: ['nextjs', 'portfolio', 'tailwindcss'],
    stargazers_count: 5, fork: false,
    pushed_at: new Date((now - 2 * DAY) * 1000).toISOString(),
    created_at: '2025-01-10T08:00:00Z',
    homepage: 'https://taylormadetech.net', forks_count: 1, archived: false,
  },
  {
    id: 101, name: 'humblelibrarysync',
    description: 'Sync utility for local library management',
    html_url: 'https://github.com/Hectormalvarez/humblelibrarysync',
    language: 'Python', topics: ['python', 'cli', 'sync'],
    stargazers_count: 3, fork: false,
    pushed_at: new Date((now - 180 * DAY) * 1000).toISOString(),
    created_at: '2024-06-01T12:00:00Z',
    homepage: null, forks_count: 0, archived: false,
  },
  {
    id: 102, name: 'laphost',
    description: 'Local development environment tool',
    html_url: 'https://github.com/Hectormalvarez/laphost',
    language: 'Shell', topics: [],
    stargazers_count: 0, fork: true,
    pushed_at: new Date((now - 30 * DAY) * 1000).toISOString(),
    created_at: '2024-09-20T15:30:00Z',
    homepage: null, forks_count: 0, archived: false,
  },
  {
    id: 103, name: 'basic-ad', description: null,
    html_url: 'https://github.com/Hectormalvarez/basic-ad',
    language: 'Python', topics: [],
    stargazers_count: 1, fork: false,
    pushed_at: new Date((now - 365 * DAY) * 1000).toISOString(),
    created_at: '2023-02-14T09:00:00Z',
    homepage: null, forks_count: 0, archived: true,
  },
  {
    id: 104, name: 'genwords', description: null,
    html_url: 'https://github.com/Hectormalvarez/genwords',
    language: 'TypeScript', topics: ['nlp', 'generator'],
    stargazers_count: 8, fork: false,
    pushed_at: new Date((now - 7 * DAY) * 1000).toISOString(),
    created_at: '2024-03-01T14:00:00Z',
    homepage: 'https://genwords.taylormadetech.net', forks_count: 2, archived: false,
  },
  {
    id: 105, name: 'palspantry',
    description: 'Community pantry inventory tracker',
    html_url: 'https://github.com/Hectormalvarez/palspantry',
    language: 'Python', topics: ['community', 'inventory'],
    stargazers_count: 0, fork: false,
    pushed_at: new Date((now - 14 * DAY) * 1000).toISOString(),
    created_at: '2024-07-10T11:00:00Z',
    homepage: null, forks_count: 0, archived: false,
  },
  {
    id: 106, name: 'text2',
    description: 'Text processing utility',
    html_url: 'https://github.com/Hectormalvarez/text2',
    language: 'JavaScript', topics: [],
    stargazers_count: 0, fork: false,
    pushed_at: new Date((now - 60 * DAY) * 1000).toISOString(),
    created_at: '2024-01-20T16:00:00Z',
    homepage: null, forks_count: 0, archived: false,
  },
];

// ── Events ───────────────────────────────────────────────────────────────────

export const mockEvents: GitHubEvent[] = [
  {
    id: 'evt-001', type: 'PushEvent', actor: mockActor, repo: mockRepo1,
    payload: {
      repository_id: 100, push_id: 9001, size: 3, distinct_size: 3,
      ref: 'refs/heads/main', head: 'abc123def456', before: '000aaa111bbb222',
      commits: [
        { sha: 'abc123', message: 'feat: add contribution heatmap', author: { name: 'Hector', email: 'h@test.com' } },
        { sha: 'def456', message: 'test: add heatmap render tests', author: { name: 'Hector', email: 'h@test.com' } },
        { sha: 'ghi789', message: 'style: refine heatmap colors', author: { name: 'Hector', email: 'h@test.com' } },
      ],
    },
    public: true, created_at: '2026-08-28T14:30:00Z',
  },
  {
    id: 'evt-002', type: 'CreateEvent', actor: mockActor, repo: mockRepo2,
    payload: {
      ref: 'main', ref_type: 'branch', master_branch: 'main',
      description: 'Sync utility for local library management', pusher_type: 'user',
    },
    public: true, created_at: '2026-08-25T09:15:00Z',
  },
  {
    id: 'evt-003', type: 'PullRequestEvent', actor: mockActor, repo: mockRepo1,
    payload: {
      action: 'opened', number: 14,
      pull_request: {
        id: 5001, title: 'Add activity timeline component',
        html_url: 'https://github.com/Hectormalvarez/tmtn_website/pull/14',
        state: 'open', merged: false, body: 'Implements the activity feed UI.',
      },
    },
    public: true, created_at: '2026-08-26T11:00:00Z',
  },
  {
    id: 'evt-004', type: 'ReleaseEvent', actor: mockActor, repo: mockRepo3,
    payload: {
      action: 'published',
      release: {
        id: 9001, tag_name: 'v1.0.0', name: 'Version 1.0.0',
        html_url: 'https://github.com/Hectormalvarez/laphost/releases/tag/v1.0.0',
        body: 'Initial release.', draft: false, prerelease: false,
      },
    },
    public: true, created_at: '2026-08-20T16:45:00Z',
  },
  {
    id: 'evt-005', type: 'WatchEvent', actor: mockActor, repo: mockRepo1,
    payload: { action: 'started' },
    public: true, created_at: '2026-08-22T10:00:00Z',
  },
];

// ── Commit Activity (52 weeks) ───────────────────────────────────────────────

function buildCommitActivity(): CommitActivityWeek[] {
  const weeks: CommitActivityWeek[] = [];
  const baseWeekTs = now - 52 * 7 * DAY;

  for (let i = 0; i < 52; i++) {
    const weekTs = baseWeekTs + i * 7 * DAY;
    const zero: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];

    if (i < 21) {
      weeks.push({ days: [...zero], total: 0, week: weekTs });
    } else if (i < 31) {
      const d: [number, number, number, number, number, number, number] = [0, 2 + (i % 3), 1 + (i % 2), 3, 0, 1 + (i % 4), 0];
      weeks.push({ days: [...d], total: d.reduce((a, b) => a + b, 0), week: weekTs });
    } else if (i === 31) {
      weeks.push({ days: [...zero], total: 0, week: weekTs });
    } else if (i <= 44) {
      const d: [number, number, number, number, number, number, number] = [0, 4, 2, 5, 1, 3, 0];
      weeks.push({ days: [...d], total: 15, week: weekTs });
    } else if (i <= 48) {
      const d: [number, number, number, number, number, number, number] = [1, 8, 6, 12, 4, 7, 1];
      weeks.push({ days: [...d], total: 39, week: weekTs });
    } else {
      const d: [number, number, number, number, number, number, number] = [0, 1, 0, 2, 0, 1, 0];
      weeks.push({ days: [...d], total: 4, week: weekTs });
    }
  }
  return weeks;
}

export const mockCommitActivity: CommitActivityWeek[] = buildCommitActivity();

// ── Aggregate Stats ──────────────────────────────────────────────────────────

export const mockAggregateStats: AggregateStats = {
  totalStars: 17,
  totalForks: 3,
  totalRepos: 7,
  languageDistribution: [
    { language: 'Python', count: 3, percentage: Math.round((3 / 7) * 100) },
    { language: 'TypeScript', count: 2, percentage: Math.round((2 / 7) * 100) },
    { language: 'Shell', count: 1, percentage: Math.round((1 / 7) * 100) },
    { language: 'JavaScript', count: 1, percentage: Math.round((1 / 7) * 100) },
  ],
  mostUsedLanguage: 'Python',
};
