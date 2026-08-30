import { CONTACT_EMAIL } from '@/constants/site';

export function ContactCard() {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
        Contact
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="inline-block border border-transparent hover:border-black transition-all cursor-pointer px-3 py-2 -ml-3"
      >
        <code className="text-sm font-mono">{CONTACT_EMAIL}</code>
      </a>
    </div>
  );
}
