import clsx from 'clsx';
import type { FunctionComponent } from 'react';

interface TextProps {
  html: string;
  className?: string;
}

const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
    <div
      className={clsx('prose', className)}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default Prose;
