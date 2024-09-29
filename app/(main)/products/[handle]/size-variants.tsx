'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/types';
import { getMetafieldValue } from 'lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'react-feather';

export function SizeVariants({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();
  const activeProduct = products.find((product) => product.handle === pathName.split('/').pop());

  return (
    <div className="mb-4">
      <label htmlFor="size-select" className="mb-2 block text-sm uppercase">
        Other sizes
      </label>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="flex items-center gap-4 border px-2 py-1 text-xs">
          {({ active }) => (
            <>
              <span>{activeProduct ? activeProduct.title : 'Select a size'}</span>
              <ChevronDown className={clsx('w-4 transition-transform', active && '-scale-y-100')} />
            </>
          )}
        </MenuButton>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MenuItems className="absolute z-10 mt-2 max-h-[200px] w-full origin-top-right overflow-auto bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:max-h-[320px]">
              {products.map((product, index) => {
                if (!product) return null;

                const widthValue = getMetafieldValue(product, 'width');
                const depthValue = getMetafieldValue(product, 'depth');
                const title = `${widthValue} x ${depthValue}mm`;
                const isActive = activeProduct?.id === product.id;

                return (
                  <MenuItem key={product.id}>
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={clsx(
                        'group flex w-full items-center px-2 py-2 text-sm hover:underline',
                        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      )}
                      onClick={() =>
                        router.push(`/${ROUTES.products}/${product.handle}?${params.toString()}`)
                      }
                    >
                      {title}
                    </motion.button>
                  </MenuItem>
                );
              })}
            </MenuItems>
          </motion.div>
        </AnimatePresence>
      </Menu>
    </div>
  );
}
