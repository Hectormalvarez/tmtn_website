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
    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
      {topic}
    </span>
  );
}

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.html_url}
      className="block border border-transparent p-4 hover:border-black hover:bg-neutral-50 cursor-pointer transition-all"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">{repo.name}</span>
        <LanguageBadge language={repo.language} />
      </div>
      {repo.description && (
        <p className="text-neutral-600 text-sm mb-2">{repo.description}</p>
      )}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
        </div>
      )}
    </a>
  );
}