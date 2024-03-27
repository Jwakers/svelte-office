import { Pagination as AlgoliaPagination } from 'react-instantsearch';

export default function Pagination() {
  return (
    <AlgoliaPagination
      classNames={{
        root: 'p-3',
        list: 'flex gap-2 items-center',
        pageItem: 'text-lg p-2',
        selectedItem: 'underline',
        firstPageItem: '[&>a]:button cursor-pointer',
        lastPageItem: '[&>a]:button cursor-pointer',
        previousPageItem: '[&>a]:button cursor-pointer',
        nextPageItem: '[&>a]:button cursor-pointer'
      }}
    />
  );
}
