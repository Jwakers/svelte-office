import Image from 'next/image';

import Price from 'components/price';

export function GridTileImage({
  isInteractive = true,
  active,
  labels,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  labels?: {
    title: string;
    amount: string;
    currencyCode: string;
    isSmall?: boolean;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {props.src ? (
        <Image
          className="relative aspect-square h-full w-full object-cover"
          {...props}
          alt={props.title || ''}
        />
      ) : null}
      {labels ? (
        <div className="mt-auto flex w-full flex-col items-end justify-between gap-2 border-t border-black bg-white p-4 md:flex-row">
          <h3 data-testid="product-name" className="font-serif md:text-lg">
            {labels.title}
          </h3>
          <Price amount={labels.amount} currencyCode={labels.currencyCode} />
        </div>
      ) : null}
    </div>
  );
}
