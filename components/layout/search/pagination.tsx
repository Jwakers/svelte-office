import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pagination as AlgoliaPagination, usePagination } from 'react-instantsearch';

export default function Pagination() {
  const { isFirstPage, isLastPage } = usePagination();
  const buttonClasses = cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'cursor-pointer');
  return (
    <AlgoliaPagination
      classNames={{
        root: 'p-3',
        list: 'flex gap-2 items-center',
        pageItem: 'text-lg p-2',
        selectedItem: 'underline',
        firstPageItem: !isFirstPage ? buttonClasses : undefined,
        lastPageItem: !isLastPage ? buttonClasses : undefined,
        previousPageItem: buttonClasses,
        nextPageItem: buttonClasses
      }}
    />
  );
}
