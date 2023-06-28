import clsx from 'clsx';
import ShoppingBagIcon from './shopping-bag';

export default function CartIcon({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative">
      <ShoppingBagIcon className={clsx('h-6', className)} />
      {!!quantity && (
        <div className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs text-white dark:bg-white dark:text-black">
          {quantity}
        </div>
      )}
    </div>
  );
}
