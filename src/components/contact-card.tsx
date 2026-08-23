import { CONTACT_EMAIL } from '@/constants/site';

export function ContactCard() {
  return (
    <div className="mb-12">
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
        Contact
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="inline-block border border-transparent hover:border-black transition-all cursor-pointer p-4"
      >
        <code className="text-lg font-mono">{CONTACT_EMAIL}</code>
      </a>
    </div>
  );
}
