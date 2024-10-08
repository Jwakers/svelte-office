'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';
import { useIsBreakpoint } from 'lib/hooks';
import { Copy, Share2 } from 'react-feather';
import toast from 'react-hot-toast';
import { FacebookShare, TwitterShare, WhatsappShare } from 'react-share-lite';

type ShareProps = {
  url: string;
  text: string;
  title: string;
};

export default function Share({ url, text, title }: ShareProps) {
  const isMd = useIsBreakpoint('md');

  const copyTextToClipboard = async () => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(url);
    } else {
      throw Error('Failed to copy to clipboard');
    }
  };

  const handleCopyClick = async () => {
    try {
      await copyTextToClipboard();
      toast.success('URL Copied to clipboard');
    } catch (err) {
      console.error(err);
      toast.error('Error copying URL to clipboard');
    }
  };

  return (
    <Menu>
      <MenuButton className="button fixed bottom-14 right-3 flex items-center gap-1 bg-white md:static">
        <>
          <span>Share</span>
          <Share2 strokeWidth={1} />
        </>
      </MenuButton>
      <MenuItems
        anchor={isMd ? 'bottom' : 'left'}
        className={clsx(
          'flex w-fit  items-center gap-2',
          isMd ? 'translate-y-2' : '-translate-x-2'
        )}
      >
        <MenuItem>
          <FacebookShare url={url} size={isMd ? 30 : 50} quote={title} />
        </MenuItem>
        <MenuItem>
          <TwitterShare url={url} size={isMd ? 30 : 50} title={title} />
        </MenuItem>
        <MenuItem>
          <WhatsappShare url={url} size={isMd ? 30 : 50} title={title} />
        </MenuItem>
        <MenuItem>
          <button onClick={handleCopyClick} title="Copy URL">
            <Copy size={isMd ? 30 : 50} strokeWidth={1} className="border bg-white p-2" />
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
