import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type CTAButtonProps = {
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: 'wine' | 'ink' | 'white' | 'outline' | 'ghost' | 'transparent';
  type?: 'button' | 'submit';
  disabled?: boolean;
  as?: 'div' | 'button' | 'span';
};

function isInternalRoute(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

export default function CTAButton({ 
  to, 
  onClick, 
  children, 
  className = '', 
  variant = 'ink',
  type = 'button',
  disabled = false,
  as
}: CTAButtonProps) {
  const variants = {
    wine: 'bg-brand-wine text-white hover:bg-ink',
    ink: 'bg-ink text-white hover:bg-brand-wine',
    white: 'bg-white text-ink hover:bg-brand-wine hover:text-white',
    outline: 'border border-ink/20 text-ink hover:border-brand-wine hover:text-brand-wine bg-transparent',
    ghost: 'text-ink/60 hover:text-brand-wine bg-transparent px-0',
    transparent: 'border border-white/40 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-ink'
  };

  const base = 'group inline-flex items-center justify-center min-h-[56px] px-12 py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-none';
  
  const combinedClassName = `${base} ${variants[variant]} ${className}`;

  if (to) {
    if (isInternalRoute(to)) {
      return (
        <Link to={to} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={to}
        className={combinedClassName}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  const Tag = as || 'button';

  return (
    <Tag
      {...(Tag === 'button' ? { type, disabled, onClick } : { onClick })}
      className={combinedClassName}
    >
      {children}
    </Tag>
  );
}
