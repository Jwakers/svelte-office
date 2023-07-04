import type { ClassValue } from 'clsx';
import clsx from 'clsx';

export const Icon = ({ name, className }: { name: string; className?: ClassValue }) => (
  <span className={clsx('material-symbols-sharp', className)}>{name}</span>
);
