import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import Banner from 'components/layout/banner';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { getPublicBaseUrl } from 'lib/utils';
import { Vollkorn, Work_Sans } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import Providers from './providers';

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
    <html lang="en" className={clsx(workSans.variable, vollkorn.variable, 'overflow-x-hidden')}>
      <body className="overflow-x-hidden text-slate-900 selection:bg-yellow-400">
        <Banner />
        <Suspense>
          <Navbar />
        </Suspense>
        <Suspense>
          <Providers>
            <main className="scroll-smooth">{children}</main>
          </Providers>
        </Suspense>
        <Suspense>
          <Footer />
        </Suspense>
        <Analytics />
        <SpeedInsights />
        <GoogleTagManager gtmId="GTM-MCW4BTKJ" />
        <GoogleAnalytics gaId="AW-11314383640" />
      </body>
    </html>
  );
}
