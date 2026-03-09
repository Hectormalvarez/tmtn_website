import Image from 'next/image';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch('https://api.github.com/users/Hectormalvarez/repos?sort=updated&per_page=4', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const repos = await getRepos();

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-4">
        <header className="py-12 border-b border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Hector Alvarez
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Systems Automation & IT Support
              </p>
              <p className="text-md font-mono text-gray-500">
                Operating under <span className="text-black font-semibold">taylormadetech.net</span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-black p-4 rounded-xl shadow-xl transition-transform hover:-rotate-2 hover:scale-105">
                <Image 
                  src="/logo.svg" 
                  alt="TMTN Logo" 
                  width={180} 
                  height={60} 
                  priority
                  className="h-auto"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Bio Section */}
        <p className="text-neutral-800 leading-relaxed mb-8">
          Focused on IT infrastructure, Software-driven automation, and building scalable technical solutions.
        </p>

        {/* Visual Card (Contact) */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Contact</p>
          <a href="mailto:halvarez@taylormadetech.net" className="inline-block border border-transparent hover:border-black transition-all cursor-pointer p-4">
            <code className="text-lg font-mono">halvarez@taylormadetech.net</code>
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mt-4">
          <a
            href="https://www.linkedin.com/in/hector-alvarez-918621117/"
            className="text-sm font-mono uppercase tracking-wider text-black border-b border-transparent hover:border-black transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Hectormalvarez"
            className="text-sm font-mono uppercase tracking-wider text-black border-b border-transparent hover:border-black transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        {/* Featured Projects */}
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
      </div>
    </main>
  );
}