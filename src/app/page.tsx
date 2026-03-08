'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Hector Alvarez</h1>
        <h2 className="text-xl text-neutral-600 mb-8">
          IT Support & Python Developer
        </h2>
        <section className="flex gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open('mailto:halvarez@taylormadetech.net', '_blank');
            }}
            className="text-blue-600 hover:underline"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/hector-alvarez-918621117/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Hectormalvarez"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </section>
      </div>
    </main>
  );
}
