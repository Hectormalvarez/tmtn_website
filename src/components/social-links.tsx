import { SOCIAL_LINKS } from '@/constants/site';

export function SocialLinks() {
  return (
    <div className="flex gap-6 mt-4">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-sm font-mono uppercase tracking-wider text-black border-b border-transparent hover:border-black transition-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
