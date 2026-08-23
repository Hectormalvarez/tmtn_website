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
      <div className="max-w-2xl mx-auto px-4">
        <Header />
        <Bio />
        <ContactCard />
        <SocialLinks />
        <ProjectGrid repos={repos} />
      </div>
    </main>
  );
}