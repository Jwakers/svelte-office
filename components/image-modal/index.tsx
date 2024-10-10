'use client';

import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { AnimatePresence, motion } from 'framer-motion';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';

interface ModalImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

interface ImageModalProps {
  img: ModalImage;
  className?: string;
}

export default function Component({ img, className }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') closeModal();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setIsLoading(true);
  }, [img]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className={clsx('cursor-pointer overflow-hidden outline-offset-2', className)}
        aria-label={`Open full-size image of ${img.altText}`}
      >
        <Image
          src={img.url}
          alt={img.altText}
          width={200}
          height={200}
          className="max-h-80 w-full object-cover"
          placeholder="blur"
          sizes={getImageSizes({ sm: '50vw', md: '25vw' })}
          onError={() => {
            console.error(`Failed to load image: ${img.url}`);
            setIsLoading(false);
          }}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleOutsideClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex max-h-[90dvh] max-w-[90dvw] bg-white p-4"
            >
              <h2 id="modal-title" className="sr-only">
                Full-size image of {img.altText}
              </h2>
              <button
                onClick={closeModal}
                className="absolute right-2 top-2 z-10 bg-white p-1 text-brand hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              <div className="relative overflow-auto">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingDots className="h-2 w-2" />
                  </div>
                )}
                <Image
                  src={img.url}
                  alt={img.altText}
                  width={img.width}
                  height={img.height}
                  className={clsx(
                    `width-full transition-opacity duration-300`,
                    isLoading ? 'opacity-0' : 'opacity-100'
                  )}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    console.error(`Failed to load image: ${img.url}`);
                    setIsLoading(false);
                  }}
                  sizes={getImageSizes({ sm: '100vw' })}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
