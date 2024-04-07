import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'app/globals.css';
import Providers from 'app/providers';
import clsx from 'clsx';
import Banner from 'components/layout/banner';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { getPublicBaseUrl } from 'lib/utils';
import { Vollkorn, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import { ReactNode, Suspense } from 'react';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(getPublicBaseUrl()),
  title: {
    default: SITE_NAME || '',
    template: `%s | ${SITE_NAME}`
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
        <Banner />
        <Suspense>
          <Navbar className="absolute w-full md:relative" />
        </Suspense>
        <Suspense>
          <Providers>
            <main>{children}</main>
          </Providers>
        </Suspense>
        <Suspense>
          <Footer />
        </Suspense>
        <Analytics />
        <SpeedInsights />
        <GoogleTagManager gtmId="GTM-MCW4BTKJ" />
        <GoogleAnalytics gaId="G-QZHC45RS9P" />
        <Script
          src="//cdn.wishpond.net/connect.js?merchantId=1849473&amp;writeKey=53c8a5082846"
          async
        />
        Í
      </body>
    </html>
  );
}
