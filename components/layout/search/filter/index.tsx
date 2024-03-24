import { SortFilterItem } from 'lib/constants';
import { FilterItem } from './item';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <div className="hidden flex-col gap-2 uppercase md:flex">
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </div>
  );
}

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav>
        {/* {title ? <h3 className="mb-2 font-serif uppercase">{title}</h3> : null}
        <ul className="flex-col gap-4 uppercase md:flex">
          <FilterItemList list={list} />
        </ul>
        <ul className="md:hidden">
          <FilterItemDropdown list={list} />
        </ul> */}
      </nav>
    </>
  );
}
