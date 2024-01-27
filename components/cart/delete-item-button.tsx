import LoadingDots from 'components/loading-dots';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useTransition } from 'react';
import { X } from 'react-feather';

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
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
      className={clsx(
        'ease flex min-w-[36px] max-w-[36px] items-center justify-center border border-slate-900 px-2 transition-all duration-200',
        {
          'cursor-not-allowed px-0': isPending
        }
      )}
    >
      {isPending ? <LoadingDots /> : <X strokeWidth={1} />}
    </button>
  );
}
