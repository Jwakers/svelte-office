import clsx, { ClassValue } from 'clsx';

export function Logo({ className }: { className?: ClassValue }) {
  return (
    <span className={clsx('font-serif font-bold tracking-tight', className)}>SvelteOffice</span>
  );
}
