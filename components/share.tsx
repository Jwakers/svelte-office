'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';
import { useIsBreakpoint } from 'lib/hooks';
import { Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { FacebookShare, TwitterShare, WhatsappShare } from 'react-share-lite';
import { Button } from './ui/button';

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
      <Button asChild>
        <MenuButton className="fixed bottom-14 right-3 md:static">
          <span>Share</span>
          <Share2 />
        </MenuButton>
      </Button>
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
          <Button onClick={handleCopyClick} title="Copy URL" className="px-0" variant="ghost">
            <Copy size={isMd ? 30 : 50} className="border bg-white p-2" />
          </Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
