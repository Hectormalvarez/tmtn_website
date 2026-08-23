import type { Repo } from '@/lib/github';

export function ProjectGrid({ repos }: { repos: Repo[] }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-6 mt-12">Featured Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            className="block border border-transparent p-4 hover:border-black hover:bg-neutral-50 cursor-pointer transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="font-semibold mb-2">{repo.name}</div>
            <p className="text-neutral-600">{repo.description}</p>
          </a>
        ))}
      </div>
    </>
  );
}
