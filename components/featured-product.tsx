import { ROUTES } from 'lib/constants';
import { getProduct } from 'lib/shopify';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';
import Price from './price';
import { ReviewStars } from './product/review-stars';

export async function FeaturedProduct() {
  const product = await getProduct('advance');
  const id = product?.id.split('/').at(-1);

  if (!product || !id) return null;

  return (
    <Link
      href={`${ROUTES.products}/${product.handle}`}
      className="group grid border-b border-brand transition-colors md:grid-cols-2"
    >
      <div className="relative">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          width={product.featuredImage.width}
          height={product.featuredImage.height}
          sizes={getImageSizes({ md: '100vw', lg: '50vw' })}
          className="w-full border-b object-cover md:absolute md:h-full md:border-none"
        />
      </div>
      <div className="h-full border-brand p-4 md:border-l">
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-secondary">Featured product</div>
            <h4 className="font-serif text-3xl md:text-4xl">{product.title}</h4>
          </div>
          <ReviewStars productId={id} />
        </div>
        <div className="mt-3 max-w-xl space-y-2">
          <p>Simple. Elegant. Precise.</p>
          <p>
            Elevate your workspace with the Advance desk. Sturdy and stylish Swedish design.
            Featuring dual, sturdy motors with an even load capacity of 120kg, the Advance maximises
            your productivity with unparalleled height adjustability. Upgrade to the ultimate desk
            for premium performance.
          </p>
        </div>
        <div className="mt-10 flex justify-between text-secondary md:mt-16">
          <span>
            From{' '}
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          </span>
          <div className="flex items-center gap-1 text-xs transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <span className="font-medium">View product</span>
            <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}
