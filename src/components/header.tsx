import Image from 'next/image';
import { SITE_NAME, SITE_TAGLINE, SITE_SUBTITLE } from '@/constants/site';

export function Header() {
  return (
    <header className="py-12 border-b border-gray-100 mb-12">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {SITE_NAME}
          </h1>
          <p className="text-xl text-gray-600 font-medium">{SITE_TAGLINE}</p>
          <p className="text-md font-mono text-gray-500">
            Operating under{' '}
            <span className="text-black font-semibold">{SITE_SUBTITLE}</span>
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
  );
}
