import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type CTAButtonProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

function isInternalRoute(href: string) {
  return href.startsWith('/');
}

export default function CTAButton({ to, children, className }: CTAButtonProps) {
  const base =
    'group inline-flex items-center justify-center min-h-[44px] px-10 py-3 border border-[#F9F9F9]/80 text-[#F9F9F9] text-label font-bold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9F9F9]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A3A3A]/40';

  const content = <span>{children}</span>;

  if (isInternalRoute(to)) {
    return (
      <Link to={to} className={`${base} hover:bg-[#F9F9F9] hover:text-[#5A252D] ${className || ''}`}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className={`${base} hover:bg-[#F9F9F9] hover:text-[#5A252D] ${className || ''}`}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  );
}
