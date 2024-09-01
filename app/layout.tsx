import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'app/globals.css';
import clsx from 'clsx';
import { getPublicBaseUrl } from 'lib/utils';
import { Vollkorn, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(getPublicBaseUrl()),
  title: {
    default: SITE_NAME || '',
    template: `%s | Svelte Office - Premium Office Furniture`
  },
  openGraph: {
    images: [
      {
        url: '/forge-corner-lifestyle.jpg',
        width: 1200,
        height: 630
      }
    ],
    type: 'website'
  },
  robots: {
    follow: true,
    index: true
  }
};

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans'
});

const vollkorn = Vollkorn({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vollkorn'
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={clsx(workSans.variable, vollkorn.variable)}>
      <body className="text-brand selection:bg-accent-yellow">
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleTagManager gtmId="GTM-MCW4BTKJ" />
        <Script src="//eu.fw-cdn.com/12852134/821894.js" chat="true" async></Script>
      </body>
    </html>
  );
}
