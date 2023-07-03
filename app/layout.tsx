import clsx from 'clsx';
import Navbar from 'components/layout/navbar';
import { Vollkorn, Work_Sans } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';

const { SITE_NAME } = process.env;

export const metadata = {
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
      <body className="text-black selection:bg-yellow-400">
        <Navbar />
        <Suspense>
          <main>{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
