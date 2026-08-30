import type { Repo, AggregateStats, LanguageDistribution } from './github.types';

export function aggregateStats(repos: Repo[]): AggregateStats {
  if (repos.length === 0) {
    return {
      totalStars: 0,
      totalForks: 0,
      totalRepos: 0,
      languageDistribution: [],
      mostUsedLanguage: null,
    };
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  const langCounts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
    }
  }

  const totalReposWithLang = [...langCounts.values()].reduce((a, b) => a + b, 0);
  const languageDistribution: LanguageDistribution[] = [...langCounts.entries()]
    .map(([language, count]) => ({
      language,
      count,
      percentage: totalReposWithLang > 0
        ? Math.round((count / totalReposWithLang) * 100)
        : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const mostUsedLanguage = languageDistribution.length > 0
    ? languageDistribution[0].language
    : null;

  return {
    totalStars,
    totalForks,
    totalRepos: repos.length,
    languageDistribution,
    mostUsedLanguage,
  };
}
