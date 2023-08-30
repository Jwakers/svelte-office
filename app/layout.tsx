import clsx from 'clsx';
import Banner from 'components/layout/banner';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Vollkorn, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import { ReactNode, Suspense } from 'react';
import './globals.css';
import Providers from './providers';

const { SITE_NAME, NEXT_PUBLIC_SITE_URL } = process.env;

export const metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? `https://${NEXT_PUBLIC_SITE_URL}`
      : 'http://localhost:3000'
  ),
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
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11314383640"></Script>
      <Script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date());
        gtag('config', 'AW-11314383640');
        gtag('config', 'G-QZHC45RS9P');
        `}
      </Script>
      <body className="text-black selection:bg-yellow-400">
        <Banner />
        <Navbar />
        <Suspense>
          <Providers>
            <main>{children}</main>
          </Providers>
        </Suspense>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
