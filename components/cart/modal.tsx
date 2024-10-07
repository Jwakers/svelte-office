'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

import Price from 'components/price';
import { DEFAULT_OPTION, ROUTES } from 'lib/constants';
import type { Cart } from 'lib/shopify/types';
import { createUrl, getImageSizes } from 'lib/utils';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Lock, ShoppingBag, X } from 'react-feather';
import DeleteItemButton from './delete-item-button';
import EditItemQuantityButton from './edit-item-quantity-button';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart, cartIdUpdated }: { cart: Cart; cartIdUpdated: boolean }) {
  const [, setCookie] = useCookies(['cartId']);
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (cartIdUpdated) {
      setCookie('cartId', cart.id, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    return;
  }, [setCookie, cartIdUpdated, cart.id]);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart.totalQuantity;
    }
  }, [isOpen, cart.totalQuantity, quantityRef]);

  return (
    <>
      <button
        className="relative flex"
        aria-label="Open cart"
        onClick={openCart}
        data-testid="open-cart"
      >
        <ShoppingBag strokeWidth={1} />
        {!!cart.totalQuantity && (
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4  transform items-center justify-center rounded-full border bg-brand p-1 text-xs text-white">
            {cart.totalQuantity}
          </span>
        )}
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50" data-testid="cart">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-brand/30 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white md:w-3/5 md:border-l lg:w-2/5">
              <div className="flex items-center justify-between p-3">
                <p className="font-serif text-2xl">My Cart</p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="hover:border hover:border-brand"
                  data-testid="close-cart"
                >
                  <X strokeWidth={1} />
                </button>
              </div>

              {cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center">
                  <ShoppingBag strokeWidth={1} />
                  <p className="mt-6 font-serif text-3xl">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="flex-grow overflow-auto p-3">
                    {cart.lines.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        `/${ROUTES.products}/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li
                          key={i}
                          className="flex flex-col gap-2 border-b py-3 last:border-b-0"
                          data-testid="cart-item"
                        >
                          <Link className="flex gap-4" href={merchandiseUrl} onClick={closeCart}>
                            <div className="relative h-16 w-16 cursor-pointer overflow-hidden bg-white">
                              <Image
                                className="h-full w-full object-cover"
                                sizes={getImageSizes({ sm: '4rem' })}
                                width={item.merchandise.product.featuredImage.width}
                                height={item.merchandise.product.featuredImage.height}
                                alt={
                                  item.merchandise.product.featuredImage.altText ||
                                  item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </div>
                            <div className="flex flex-1 flex-col text-base">
                              <span className="font-semibold">
                                {item.merchandise.product.title}
                              </span>
                              {item.merchandise.title !== DEFAULT_OPTION ? (
                                <p className="text-sm" data-testid="cart-product-variant">
                                  {item.merchandise.title}
                                </p>
                              ) : null}
                            </div>
                            <Price
                              className="flex flex-col justify-between space-y-2 text-sm"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                          </Link>
                          <div className="flex h-9">
                            <DeleteItemButton item={item} />
                            <p className="flex w-full items-center justify-center border border-l-0 border-brand">
                              <span className="w-full px-2">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="minus" />
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="border-t pt-2 text-sm">
                    <div className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p>Subtotal</p>
                        <Price
                          className="text-right"
                          amount={cart.cost.subtotalAmount.amount}
                          currencyCode={cart.cost.subtotalAmount.currencyCode}
                        />
                      </div>
                      {parseFloat(cart.cost.totalTaxAmount.amount) > 0 ? (
                        <div className="mb-2 flex items-center justify-between">
                          <p>Taxes</p>
                          <Price
                            className="text-right"
                            amount={cart.cost.totalTaxAmount.amount}
                            currencyCode={cart.cost.totalTaxAmount.currencyCode}
                          />
                        </div>
                      ) : null}
                      <div className="mb-2 flex items-center justify-between border-b pb-2">
                        <p>Shipping</p>
                        <p className="text-right">FREE</p>
                      </div>
                      <div className="mb-2 flex items-center justify-between font-bold">
                        <p>Total</p>
                        <Price
                          className="text-right"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode}
                        />
                      </div>
                      <a
                        href={cart.checkoutUrl}
                        className="flex w-full items-center justify-center gap-2 border bg-brand p-3 text-sm uppercase text-white transition-colors hover:bg-white hover:text-brand"
                      >
                        <span>Proceed to Secure Checkout</span>
                        <Lock strokeWidth={1} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
