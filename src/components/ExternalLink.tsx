import type { ReactNode } from 'react';
import { content } from '../config/content';
import { isUsableUrl } from '../logic/url';

interface ExternalLinkProps {
  href: string | null | undefined;
  variant: 'primary' | 'secondary' | 'text' | 'inline';
  /** Decorative trailing glyph. */
  icon?: string;
  children: ReactNode;
}

export function ExternalLink({ href, variant, icon = '↗', children }: ExternalLinkProps) {
  const className = variant === 'inline' ? 'hmp-link' : `hmp-btn hmp-btn--${variant}`;

  if (!isUsableUrl(href)) {
    return (
      <span className={`${className} hmp-btn--unavailable`}>
        {children} <span className="hmp-small">({content.common.linkUnavailable})</span>
      </span>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      {variant !== 'inline' && <span aria-hidden="true">{icon}</span>}
      <span className="hmp-sr-only"> ({content.common.opensInNewTab})</span>
    </a>
  );
}
