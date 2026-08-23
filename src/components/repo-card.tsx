import type { Repo } from '@/lib/github';

const LANGUAGE_COLORS: Record<string, string> = {
  Python: 'bg-blue-100 text-blue-800',
  TypeScript: 'bg-blue-50 text-blue-700',
  JavaScript: 'bg-yellow-50 text-yellow-800',
  Shell: 'bg-green-50 text-green-700',
  HCL: 'bg-purple-50 text-purple-700',
  PowerShell: 'bg-sky-50 text-sky-700',
};

function LanguageBadge({ language }: { language: string | null }) {
  if (!language) return null;
  const colorClass = LANGUAGE_COLORS[language] ?? 'bg-neutral-100 text-neutral-700';

  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${colorClass}`}>
      {language}
    </span>
  );
}

function TopicChip({ topic }: { topic: string }) {
  return (
    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-500">
      {topic}
    </span>
  );
}

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.html_url}
      className="group block border border-neutral-200 rounded-lg p-5 hover:border-neutral-400 hover:shadow-sm cursor-pointer transition-all"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{repo.name}</span>
          <LanguageBadge language={repo.language} />
        </div>
        <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors text-sm">
          ↗
        </span>
      </div>
      {repo.description && (
        <p className="text-neutral-500 text-sm leading-relaxed mb-3 line-clamp-2">
          {repo.description}
        </p>
      )}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {repo.topics.map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
        </div>
      )}
    </a>
  );
}