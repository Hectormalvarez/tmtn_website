import { SITE_NAME } from '@/constants/site';
import type { UserProfile } from '@/lib/github.types';

interface HeaderProps {
  profile: UserProfile;
  totalStars: number;
}

export function Header({ profile, totalStars }: HeaderProps) {
  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <header className="pt-4 pb-3">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {SITE_NAME}
        </h1>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: profile.public_repos, label: 'repos' },
            { value: totalStars, label: 'stars', icon: '★' },
            { value: profile.followers, label: 'followers' },
            { value: joinYear, label: 'since' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col border border-neutral-200 rounded-md px-2 py-2.5">
              <span className="text-xl font-bold text-black leading-none">
                {stat.icon && <span className="text-neutral-400 mr-0.5">{stat.icon}</span>}
                {stat.value}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wide text-neutral-400 mt-1.5 leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
