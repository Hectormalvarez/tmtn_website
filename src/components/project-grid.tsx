'use client';

import { useState } from 'react';
import type { Repo } from '@/lib/github';
import { RepoCard } from '@/components/repo-card';

const SHOW_BY_DEFAULT = 8;

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
  const [showAll, setShowAll] = useState(false);

  const filtered = activeLanguage
    ? repos.filter((r) => r.language === activeLanguage)
    : repos;

  const visible = showAll ? filtered : filtered.slice(0, SHOW_BY_DEFAULT);

  return (
    <>
      <div className="bg-white pt-4 pb-4">
        <h3 className="text-2xl font-bold mb-6">Featured Projects</h3>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveLanguage(null); setShowAll(false); }}
            className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
              activeLanguage === null
                ? 'border-black bg-black text-white'
                : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700'
            }`}
          >
            All ({repos.length})
          </button>
          {languages.map((lang) => {
            const count = repos.filter((r) => r.language === lang).length;
            return (
              <button
                key={lang}
                onClick={() => { setActiveLanguage(lang); setShowAll(false); }}
                className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
                  activeLanguage === lang
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700'
                }`}
              >
                {lang} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {filtered.length > SHOW_BY_DEFAULT && (
        <div className="flex justify-center mt-8 pb-4">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-mono px-6 py-2 rounded-md border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
          >
            {showAll ? 'Show less' : `Show all ${filtered.length}`}
          </button>
        </div>
      )}
    </>
  );
}
