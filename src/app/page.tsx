'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Hector Alvarez</h1>
        <h2 className="text-xl text-neutral-600 mb-8">
          IT Support & Python Developer
        </h2>
        
        {/* Bio Section */}
        <p className="text-neutral-800 leading-relaxed mb-8">
          Focused on IT infrastructure, Python-driven automation, and building scalable technical solutions.
        </p>

        {/* Visual Card (Contact) */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Contact</p>
          <div className="inline-block border border-black p-4">
            <code className="text-lg font-mono">halvarez@taylormadetech.net</code>
          </div>
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
          {/* Project 1: Retail Bot Engine */}
          <div className="border border-neutral-200 p-4 hover:border-black transition-colors">
            <h4 className="text-lg font-semibold mb-2">Retail Bot Engine</h4>
            <p className="text-neutral-600">
              A Telegram-based retail automation engine built with Python and Docker.
            </p>
          </div>

          {/* Project 2: Ansible Workstation */}
          <div className="border border-neutral-200 p-4 hover:border-black transition-colors">
            <h4 className="text-lg font-semibold mb-2">Ansible Workstation</h4>
            <p className="text-neutral-600">
              Infrastructure as Code for automated Ubuntu workstation provisioning.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
