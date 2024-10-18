import LoadingDots from 'components/loading-dots';
import { useRouter } from 'next/navigation';

import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { X } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '../ui/button';

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      aria-label="Remove cart item"
      onClick={() => {
        startTransition(async () => {
          const error = await removeItem(item.id);

          if (error) {
            alert(error);
            return;
          }

          router.refresh();
        });
      }}
      disabled={isPending}
      size="icon"
    >
      {isPending ? <LoadingDots /> : <X />}
    </Button>
  );
}
