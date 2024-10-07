import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import clsx from 'clsx';
import { removeItem, updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { Minus, Plus } from 'react-feather';

export default function EditItemQuantityButton({
  item,
  type
}: {
  item: CartItem;
  type: 'plus' | 'minus';
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      onClick={() => {
        startTransition(async () => {
          const error =
            type === 'minus' && item.quantity - 1 === 0
              ? await removeItem(item.id)
              : await updateItemQuantity({
                  lineId: item.id,
                  variantId: item.merchandise.id,
                  quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
                });

          if (error) {
            alert(error);
            return;
          }

          router.refresh();
        });
      }}
      disabled={isPending}
      className={clsx(
        'transition-color flex min-w-[36px] max-w-[36px] items-center justify-center border border-l-0 px-2 hover:bg-brand hover:text-white',
        {
          'cursor-not-allowed': isPending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {isPending ? (
        <LoadingDots />
      ) : type === 'plus' ? (
        <Plus strokeWidth={1} />
      ) : (
        <Minus strokeWidth={1} />
      )}
    </button>
  );
}
