import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import clsx from 'clsx';
import { removeItem, updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib/shopify/types';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../ui/button';

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
    <Button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      size="icon"
      variant="outline"
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
      className={clsx('border-l-0', {
        'ml-auto': type === 'minus'
      })}
    >
      {isPending ? <LoadingDots /> : type === 'plus' ? <Plus /> : <Minus />}
    </Button>
  );
}
