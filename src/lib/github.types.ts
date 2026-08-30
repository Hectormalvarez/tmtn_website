// ── Repository ───────────────────────────────────────────────────────────────

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
  created_at: string;
  homepage: string | null;
  forks_count: number;
  archived: boolean;
}

// ── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  hireable: boolean | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

// ── Events ───────────────────────────────────────────────────────────────────

export type EventType =
  | 'PushEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'PullRequestEvent'
  | 'IssuesEvent'
  | 'ReleaseEvent'
  | 'WatchEvent'
  | 'ForkEvent'
  | 'PullRequestReviewEvent'
  | 'MemberEvent'
  | 'PublicEvent';

export interface EventActor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface EventRepo {
  id: number;
  name: string;
  url: string;
}

export interface PushPayload {
  repository_id: number;
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: Array<{
    sha: string;
    message: string;
    author: { name: string; email: string };
  }>;
}

export interface CreatePayload {
  ref: string;
  ref_type: 'repository' | 'branch' | 'tag';
  master_branch: string;
  description: string | null;
  pusher_type: string;
}

export interface DeletePayload {
  ref: string;
  ref_type: 'branch' | 'tag';
}

export interface WatchPayload {
  action: 'started';
}

export interface ForkPayload {
  forkee: {
    id: number;
    full_name: string;
    html_url: string;
    description: string | null;
  };
}

export interface PullRequestPayload {
  action: string;
  number: number;
  pull_request: {
    id: number;
    title: string;
    html_url: string;
    state: string;
    merged: boolean;
    body: string | null;
  };
}

export interface IssuesPayload {
  action: string;
  issue: {
    id: number;
    number: number;
    title: string;
    html_url: string;
    state: string;
    body: string | null;
  };
}

export interface ReleasePayload {
  action: string;
  release: {
    id: number;
    tag_name: string;
    name: string | null;
    html_url: string;
    body: string | null;
    draft: boolean;
    prerelease: boolean;
  };
}

export interface PullRequestReviewPayload {
  action: 'created' | 'edited' | 'dismissed';
  review: {
    id: number;
    body: string | null;
    state: string;
  };
  pull_request: {
    id: number;
    title: string;
    html_url: string;
  };
}

export interface MemberPayload {
  action: 'added' | 'removed';
  member: {
    login: string;
    html_url: string;
  };
}

export interface PublicPayload {
  // No additional fields
}

export type EventPayload =
  | PushPayload
  | CreatePayload
  | DeletePayload
  | WatchPayload
  | ForkPayload
  | PullRequestPayload
  | IssuesPayload
  | ReleasePayload
  | PullRequestReviewPayload
  | MemberPayload
  | PublicPayload;

export interface GitHubEvent {
  id: string;
  type: EventType;
  actor: EventActor;
  repo: EventRepo;
  payload: EventPayload;
  public: boolean;
  created_at: string;
}

// ── Commit Activity (per repo, last 52 weeks) ───────────────────────────────

export interface CommitActivityWeek {
  /** Commit counts for each day: [Sun, Mon, Tue, Wed, Thu, Fri, Sat] */
  days: [number, number, number, number, number, number, number];
  /** Total commits in this week */
  total: number;
  /** Unix timestamp (seconds) for the start of the week (Monday) */
  week: number;
}

// ── Aggregate Stats ──────────────────────────────────────────────────────────

export interface LanguageDistribution {
  language: string;
  count: number;
  percentage: number;
}

export interface AggregateStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languageDistribution: LanguageDistribution[];
  mostUsedLanguage: string | null;
}
