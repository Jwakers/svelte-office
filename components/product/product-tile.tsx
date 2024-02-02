import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';

export default function ProductTile({ product }: { product: Product }) {
  const hasVariants = product.variants.length > 1;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex h-full flex-col outline outline-1 outline-black"
    >
      <Image
        src={product.featuredImage.url}
        width={640}
        height={320}
        alt={product.featuredImage.altText}
        className="aspect-square w-full object-cover"
      />
      <div className="flex h-full flex-col border-t border-slate-900 bg-white p-3">
        <h2 className="font-serif text-lg uppercase md:text-xl">{product.title}</h2>
        {hasVariants && <span className="text-sm text-slate-700">Multiple options</span>}
        <div className="mt-auto flex justify-between">
          <div>
            {hasVariants && <span>from &nbsp;</span>}
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          </div>
          <ArrowRight className="transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
