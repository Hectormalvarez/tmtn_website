export type { Repo, UserProfile, GitHubEvent, EventType, CommitActivityWeek, AggregateStats } from './github.types';

import type { Repo, UserProfile, GitHubEvent } from './github.types';

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
