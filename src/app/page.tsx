import { getRepos } from '@/lib/github';
import { Header } from '@/components/header';
import { Bio } from '@/components/bio';
import { ContactCard } from '@/components/contact-card';
import { SocialLinks } from '@/components/social-links';
import { ProjectGrid } from '@/components/project-grid';

export default async function Home() {
  const repos = await getRepos();

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
          <aside className="lg:sticky lg:top-4 lg:self-start lg:pr-4">
            <Header />
            <Bio />
            <ContactCard />
            <SocialLinks />
          </aside>
          <section>
            <ProjectGrid repos={repos} />
          </section>
        </div>
      </div>
    </main>
  );
}