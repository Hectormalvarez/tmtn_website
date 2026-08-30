import Image from 'next/image';
import { SITE_NAME, SITE_TAGLINE, SITE_SUBTITLE } from '@/constants/site';
import type { UserProfile } from '@/lib/github.types';

interface HeaderProps {
  profile: UserProfile;
  totalStars: number;
}

export function Header({ profile, totalStars }: HeaderProps) {
  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <header className="pt-8 pb-6 mb-6">
      <div className="flex flex-col gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {SITE_NAME}
          </h1>
          <p className="text-lg text-gray-600 font-medium">{SITE_TAGLINE}</p>
          <p className="text-sm font-mono text-gray-500">
            Operating under{' '}
            <span className="text-black font-semibold">{SITE_SUBTITLE}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <span>{profile.public_repos} repos</span>
          <span>★ {totalStars}</span>
          <span>{profile.followers} followers</span>
          <span>since {joinYear}</span>
        </div>
        <div>
          <div className="bg-black p-3 rounded-xl shadow-xl transition-transform hover:-rotate-2 hover:scale-105 w-fit">
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
      </div>
    </header>
  );
}
