export type { Repo, UserProfile, GitHubEvent, EventType, CommitActivityWeek, AggregateStats } from './github.types';

import type { Repo, UserProfile, GitHubEvent, EventType } from './github.types';

const SUPPORTED_EVENT_TYPES: EventType[] = [
  'PushEvent',
  'CreateEvent',
  'PullRequestEvent',
  'ReleaseEvent',
];

function getGithubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `token ${token}` } : {};
}

export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/Hectormalvarez/repos?sort=updated&per_page=100',
      {
        headers: getGithubHeaders(),
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((repo: Record<string, unknown>) => ({
      id: repo.id as number,
      name: repo.name as string,
      description: repo.description as string | null,
      html_url: repo.html_url as string,
      language: repo.language as string | null,
      topics: (repo.topics as string[]) ?? [],
      stargazers_count: (repo.stargazers_count as number) ?? 0,
      fork: (repo.fork as boolean) ?? false,
      pushed_at: repo.pushed_at as string,
      created_at: repo.created_at as string,
      homepage: repo.homepage as string | null,
      forks_count: (repo.forks_count as number) ?? 0,
      archived: (repo.archived as boolean) ?? false,
    }));
  } catch {
    return [];
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch(
      'https://api.github.com/users/Hectormalvarez',
      {
        headers: getGithubHeaders(),
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      login: data.login as string,
      avatar_url: data.avatar_url as string,
      html_url: data.html_url as string,
      name: data.name as string | null,
      bio: data.bio as string | null,
      location: data.location as string | null,
      company: data.company as string | null,
      blog: data.blog as string | null,
      hireable: data.hireable as boolean | null,
      twitter_username: data.twitter_username as string | null,
      public_repos: (data.public_repos as number) ?? 0,
      public_gists: (data.public_gists as number) ?? 0,
      followers: (data.followers as number) ?? 0,
      following: (data.following as number) ?? 0,
      created_at: data.created_at as string,
    };
  } catch {
    return null;
  }
}

export async function getUserEvents(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/Hectormalvarez/events?per_page=30',
      {
        headers: getGithubHeaders(),
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data as GitHubEvent[]).filter((event) =>
      SUPPORTED_EVENT_TYPES.includes(event.type)
    );
  } catch {
    return [];
  }
}
