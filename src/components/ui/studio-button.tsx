import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function StudioButton({
  children,
  href,
  onClick,
  light = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  light?: boolean;
}) {
  const body = (
    <>
      {children}
      <span>
        <ArrowUpRight size={20} />
      </span>
    </>
  );
  return href ? (
    <a className={`button studio-button ${light ? 'light' : ''}`} href={href}>
      {body}
    </a>
  ) : (
    <button
      type="button"
      className={`button studio-button ${light ? 'light' : ''}`}
      onClick={onClick}
    >
      {body}
    </button>
  );
}
