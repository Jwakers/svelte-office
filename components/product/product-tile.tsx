import Price from 'components/price';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductTile({ product }: { product: Product }) {
  const hasVariants = product.variants.length > 1;

  return (
    <Link
      href={`/${ROUTES.products}/${product.handle}`}
      className="group flex h-full flex-col shadow-border"
    >
      <Image
        src={product.featuredImage.url}
        width={product.featuredImage.width}
        height={product.featuredImage.height}
        alt={product.featuredImage.altText}
        sizes={getImageSizes({ sm: '100vw', md: '50vw', lg: '33vw', xl: '25vw' })}
        className="aspect-square w-full object-cover"
      />
      <div className="flex h-full flex-col border-t bg-white p-3">
        <h2 className="font-serif text-lg uppercase md:text-xl">{product.title}</h2>
        {hasVariants && <span className="text-sm text-secondary">Multiple options</span>}
        <div className="mt-auto flex justify-between">
          <div>
            {hasVariants && <span>from &nbsp;</span>}
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          </div>
          <div className="flex items-center gap-1 text-xs transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <span className="font-medium">View product</span>
            <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}
