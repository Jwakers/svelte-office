import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import Banner from 'components/layout/banner';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { getPublicBaseUrl } from 'lib/utils';
import { Vollkorn, Work_Sans } from 'next/font/google';
import Script from 'next/script';
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
    <html lang="en" className={clsx(workSans.variable, vollkorn.variable)}>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11314383640"></Script>
      <Script>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MCW4BTKJ');`}
      </Script>
      <Script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date());
        gtag('config', 'AW-11314383640');
        gtag('config', 'G-QZHC45RS9P');
        `}
      </Script>
      <body className="text-slate-900 selection:bg-yellow-400">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MCW4BTKJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <Banner />
        <Suspense>
          <Navbar />
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
      </body>
    </html>
  );
}
