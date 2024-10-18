'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/types';
import { getMetafieldValue } from 'lib/utils';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Price from '../price';
import { Button } from '../ui/button';

export function SizeVariants({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const activeProduct = useMemo(() => {
    return products.find((product) => product.handle === pathName.split('/').pop());
  }, [products, pathName]);

  if (products.length === 0) return null;

  return (
    <div className="mb-2">
      <label htmlFor="size-select" className="mb-2 block text-sm uppercase">
        Other sizes
      </label>
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="max-w-full">
          <Button variant="outline">
            <span className="truncate">
              {activeProduct ? activeProduct.title : 'Select a size'}
            </span>
            <ChevronDown className={clsx('w-4 transition-transform', isOpen && '-scale-y-100')} />
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuContent>
              {products.map((product, index) => {
                if (!product) return null;

                const widthValue = getMetafieldValue(product, 'width');
                const depthValue = getMetafieldValue(product, 'depth');
                const title = `${widthValue} x ${depthValue}mm`;
                const isActive = activeProduct?.id === product.id;

                if (isActive) return null;

                return (
                  <DropdownMenuItem key={product.id} asChild>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() =>
                        router.push(`/${ROUTES.products}/${product.handle}?${params.toString()}`)
                      }
                      className="flex w-full items-center gap-2"
                    >
                      <span>{title}</span>
                      <span className="ml-auto opacity-25">&bull;</span>
                      <Price
                        className="ml-auto"
                        amount={product.priceRange.minVariantPrice.amount}
                        currencyCode={product.priceRange.minVariantPrice.currencyCode}
                      />
                    </motion.button>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </motion.div>
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
}
