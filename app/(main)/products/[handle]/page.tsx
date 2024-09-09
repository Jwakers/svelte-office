import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Accordion from 'components/product/accordion';
import { Gallery } from 'components/product/gallery';
import ProductTile from 'components/product/product-tile';
import { ReviewStars } from 'components/product/review-stars';
import { VariantSelector } from 'components/product/variant-selector';
import Prose from 'components/prose';
import ReadMore from 'components/read-more';
import {
  DELIVERY_OPTIONS,
  DeliveryTypes,
  HIDDEN_PRODUCT_TAG,
  ROUTES,
  UNIT_MAP,
  WARRANTY
} from 'lib/constants';
import { getGenericFile, getProduct, getProductRecommendations, getProducts } from 'lib/shopify';
import { Product, ShopifyVendors } from 'lib/shopify/types';
import { getPublicBaseUrl } from 'lib/utils';
import { getReviews } from 'lib/yotpo';
import Link from 'next/link';
import Script from 'next/script';
import { Suspense } from 'react';
import { Download } from 'react-feather';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: {
      images: [
        {
          url,
          width,
          height,
          alt
        }
      ],
      description: product.seo.description || product.description
    }
  };
}

function DeliverySection({
  vendor,
  deliveryType
}: {
  vendor: ShopifyVendors;
  deliveryType: keyof DeliveryTypes;
}) {
  return (
    <Accordion heading="Delivery and Returns">
      <div className="flex flex-col gap-2">
        <div className="py-2">
          <h3 className="font-medium">Delivery</h3>
          <p>{DELIVERY_OPTIONS[vendor][deliveryType]}</p>
          <p>
            For more information see our{' '}
            <Link href="/delivery" className="underline">
              delivery details page.
            </Link>
          </p>
        </div>
        <div>
          <h3 className="font-medium">Returns</h3>
          <p>
            For more information see our{' '}
            <Link href="/returns" className="underline">
              Returns page.
            </Link>
          </p>
        </div>
      </div>
    </Accordion>
  );
}

export async function generateStaticParams() {
  const products = await getProducts({});
  const handles = products.map((product) => ({ handle: product.handle }));

  return handles;
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) notFound();

  let specSheet: string | undefined;
  if (product.specificationSheet)
    specSheet = await getGenericFile(product.specificationSheet.value);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product?.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <section className="animate-fadeIn border-b border-brand md:grid md:grid-cols-2">
        <div className="relative flex flex-col border-brand md:border-r">
          <Gallery images={product.images} options={product.options} variants={product.variants} />
        </div>
        <div className="flex flex-col gap-4 p-3">
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <h1 className="font-serif text-2xl md:text-3xl">{product.title}</h1>
              <ReviewsHead productId={product.id} />
            </div>
            <VariantSelector options={product.options} variants={product.variants} />
          </div>
          {product.descriptionHtml ? (
            <ReadMore>
              <Prose className="" html={product.descriptionHtml} />
            </ReadMore>
          ) : null}
          <div>
            {product.specification.length || specSheet ? (
              <Accordion heading="Specification">
                {product.specification.length && (
                  <table className="py-2">
                    <tbody>
                      {product.specification.map((spec) => {
                        if (!spec) return null;
                        const value = JSON.parse(spec.value);
                        return (
                          <tr className="border-b border-brand/20" key={spec.key}>
                            <td className="py-2 capitalize">{spec.key}</td>
                            <td>
                              {value.value} {UNIT_MAP[value.unit as keyof typeof UNIT_MAP] || ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {specSheet ? (
                  <a
                    className="button mb-4 mt-2 flex items-center justify-center gap-2"
                    href={specSheet}
                    target="_black"
                  >
                    <span>Download full specification</span>
                    <Download width={18} />
                  </a>
                ) : null}
              </Accordion>
            ) : null}

            <DeliverySection
              vendor={product.vendor as ShopifyVendors}
              deliveryType={product.deliveryType.value as keyof DeliveryTypes}
            />
            <Accordion heading="Warranty">
              <p className="py-2">{WARRANTY[product.vendor]}</p>
            </Accordion>
          </div>
          <AddToCart
            variants={product.variants}
            availableForSale={product.availableForSale}
            product={product}
            className={clsx({ 'sticky bottom-14 md:bottom-4': product.availableForSale })}
          />
        </div>
      </section>
      <ReviewSection product={product} />
      <Suspense>
        <RelatedProducts id={product.id} />
      </Suspense>
    </>
  );
}

async function ReviewsHead({ productId }: { productId: string }) {
  const id = productId.split('/').at(-1);
  if (!id) return;

  const {
    response: {
      bottomline: { average_score }
    }
  } = await getReviews(id);

  if (average_score <= 3) return null;

  return (
    <a className="group relative block" href="#reviews" title="Go to reviews">
      <ReviewStars productId={productId} />
      <div className="absolute bottom-0 right-0 hidden translate-y-full pt-1 text-sm text-secondary group-hover:block group-hover:text-brand group-hover:underline">
        Go to reviews
      </div>
    </a>
  );
}

function ReviewSection({ product }: { product: Product }) {
  const productId = product.id.split('/').at(-1);

  return (
    <>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src="//staticw2.yotpo.com/${process.env.YOTPO_STORE_ID}/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();
      `
        }}
      />
      <div
        id="reviews"
        className="yotpo yotpo-main-widget scroll-smooth"
        data-product-id={productId}
        data-price={product.priceRange.minVariantPrice.amount}
        data-currency={product.priceRange.minVariantPrice.currencyCode}
        data-name={product.title}
        data-url={`${getPublicBaseUrl()}/${ROUTES.products}/${product.handle}`}
        data-image-url={product.images[0]?.url}
      ></div>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  const products = relatedProducts.slice(0, 4);

  return (
    <div className="py-8">
      <div className="mb-4 px-3 font-serif text-3xl">Related Products</div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductTile product={product} />
        ))}
      </ul>
    </div>
  );
}
