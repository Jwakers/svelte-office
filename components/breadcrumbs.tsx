import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';

type BreadcrumbsProps = {
  parents?: {
    href: string;
    text: string;
  }[];
  current: string;
  className?: ClassValue;
};

export default function Breadcrumbs({ parents, current, className }: BreadcrumbsProps) {
  return (
    <Breadcrumb className={cn('my-2 px-3 md:px-4', className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {parents?.map((parent) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={parent.href}>{parent.text}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem className="truncate">
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
