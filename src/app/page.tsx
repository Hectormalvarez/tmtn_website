import { getRepos, getUserProfile } from '@/lib/github';
import Image from 'next/image';
import { Header } from '@/components/header';
import { ContactCard } from '@/components/contact-card';
import { SocialLinks } from '@/components/social-links';
import { ProjectGrid, type RepoWithStale } from '@/components/project-grid';
import { ContributionHeatmap } from '@/components/contribution-heatmap';
import { aggregateStats } from '@/lib/aggregate-stats';
import { SITE_TAGLINE, SITE_SUBTITLE } from '@/constants/site';

const STALE_THRESHOLD_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export default async function Home() {
  const [repos, profile] = await Promise.all([getRepos(), getUserProfile()]);
  const stats = aggregateStats(repos);

  // Compute isStale at build time to avoid hydration mismatch
  const reposWithStale: RepoWithStale[] = repos.map((repo) => ({
    ...repo,
    isStale: Date.now() - new Date(repo.pushed_at).getTime() > STALE_THRESHOLD_MS,
  }));

  // Fetch commit activity for top 10 most-recently-pushed repos (non-forks)
  const topRepos = repos
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 10);

  const allActivity = await Promise.all(
    topRepos.map((r) =>
      import('@/lib/github').then((m) => m.getRepoCommitActivity(r.name)),
    ),
  );

  // Merge and aggregate commit activity across repos by week
  const weekMap = new Map<number, [number, number, number, number, number, number, number]>();
  for (const repoWeeks of allActivity) {
    for (const week of repoWeeks) {
      const existing = weekMap.get(week.week);
      if (existing) {
        for (let d = 0; d < 7; d++) existing[d] += week.days[d];
      } else {
        weekMap.set(week.week, [...week.days] as [number, number, number, number, number, number, number]);
      }
    }
  }

  const heatmapData = [...weekMap.entries()]
    .sort(([a], [b]) => a - b)
    .slice(-13) // Last 3 months only
    .map(([week, days]) => ({
      days,
      total: days.reduce((s, v) => s + v, 0),
      week,
    }));

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12">
          <aside className="lg:sticky lg:top-4 lg:self-start lg:pr-4 flex flex-col gap-3">
            {profile && <Header profile={profile} totalStars={stats.totalStars} />}
            <ContactCard />
            <SocialLinks />
            <ContributionHeatmap data={heatmapData} />
          </aside>
          <section className="pt-6">
            <div className="flex items-start justify-between gap-8 mb-10">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{SITE_TAGLINE}</h2>
                <p className="text-sm font-mono text-neutral-500">
                  Operating under{' '}
                  <span className="text-black font-semibold">{SITE_SUBTITLE}</span>
                </p>
                <p className="text-neutral-600 leading-relaxed max-w-lg">
                  Focused on IT infrastructure, Software-driven automation, and building
                  scalable technical solutions.
                </p>
              </div>
              <div className="bg-black p-3 rounded-xl shadow-xl transition-transform hover:-rotate-2 hover:scale-105 shrink-0 mt-1">
                <Image
                  src="/logo.svg"
                  alt="TMTN Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-auto"
                />
              </div>
            </div>
            <ProjectGrid repos={reposWithStale} />
          </section>
        </div>
      </div>
    </main>
  );
}