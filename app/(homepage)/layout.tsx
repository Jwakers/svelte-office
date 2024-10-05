import { EmailSignupModalComponent } from '@/components/email-signup-modal';
import 'app/globals.css';
import Providers from 'app/providers';
import Banner from 'components/layout/banner';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { ReactNode, Suspense } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Banner />
      <Suspense>
        <Navbar className="absolute w-full" />
      </Suspense>
      <Suspense>
        <Providers>
          <main className="animate-fadeIn">{children}</main>
          <EmailSignupModalComponent />
        </Providers>
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
