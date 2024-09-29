import clsx from 'clsx';

const dots = 'inline-block h-1 w-1 animate-blink rounded-md border-brand border bg-white';

const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <span className="mx-2 inline-flex items-center gap-1">
      <span className={clsx(dots, className)} />
      <span className={clsx(dots, className, 'animation-delay-[200ms]')} />
      <span className={clsx(dots, className, 'animation-delay-[400ms]')} />
    </span>
  );
};

export default LoadingDots;
