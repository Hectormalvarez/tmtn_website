'use client';

import { useState } from 'react';
import type { Repo } from '@/lib/github';
import { RepoCard } from '@/components/repo-card';

function getLanguages(repos: Repo[]): string[] {
  const langs = new Set<string>();
  for (const repo of repos) {
    if (repo.language) langs.add(repo.language);
  }
  return Array.from(langs).sort();
}

export function ProjectGrid({ repos }: { repos: Repo[] }) {
  const languages = getLanguages(repos);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const filtered = activeLanguage
    ? repos.filter((r) => r.language === activeLanguage)
    : repos;

  return (
    <>
      <h3 className="text-2xl font-bold mb-6 mt-12">Featured Projects</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveLanguage(null)}
          className={`text-xs font-mono px-3 py-1 rounded transition-colors ${
            activeLanguage === null
              ? 'bg-black text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All ({repos.length})
        </button>
        {languages.map((lang) => {
          const count = repos.filter((r) => r.language === lang).length;
          return (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`text-xs font-mono px-3 py-1 rounded transition-colors ${
                activeLanguage === lang
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {lang} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </>
  );
}
