import Link from "next/link";

type BrandProps = {
  href: string;
  className: string;
};

export default function Brand({ href, className }: BrandProps) {
  return (
    <Link className={`brand-lockup ${className}`} href={href} aria-label="TranspaTech, accueil">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 17V13m4 4V9m5 8V6m5 11v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m5 10 4-3 5 1 5-4" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="4" r="1.5" fill="#7dd3fc" />
        </svg>
      </span>
      <span className="brand-wordmark">Transpa<span className="brand-tech">Tech</span></span>
    </Link>
  );
}
