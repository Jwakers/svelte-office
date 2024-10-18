import Link from 'next/link';

import { Logo } from 'components/logo';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import { Facebook, Instagram } from 'lucide-react';
import FooterSignupForm from '../footer-signup-form';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const menu = await getMenu('footer');

  return (
    <footer className="border-t bg-white pb-11 md:pb-0">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-b py-12 transition-colors duration-150 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-3">
            <a
              className="flex flex-initial items-center font-serif font-bold md:mr-24"
              href="/"
              title="Go to the home page"
            >
              <span className="mr-2">
                <Logo />
              </span>
            </a>
          </div>
          {menu.length ? (
            <nav className="col-span-1 lg:col-span-7">
              <ul className="grid md:grid-flow-col md:grid-cols-3 md:grid-rows-3">
                {menu.map((item: Menu) => (
                  <li key={item.title} className="py-3 md:py-0 md:pb-4">
                    <Link href={item.path} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <div className="flex gap-4 md:col-span-3">
            <a
              href="https://www.facebook.com/people/Svelte-Office/61557356429541/"
              title="Svelte Office Facebook"
              target="_blank"
              rel="noopener"
            >
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/svelteoffice/"
              title="Svelte Office Instagram"
              target="_blank"
              rel="noopener"
            >
              <Instagram />
            </a>
          </div>
          <div className="md:col-start-1 md:col-end-9">
            <FooterSignupForm />
          </div>
        </div>
        <div className="flex flex-col pb-10 pt-6 text-xs">
          <p>
            Svelte Office<sup>&reg;</sup> is a registered trademark of Wakeham Retail LTD
          </p>
          <p>Company Reg No: 15004801</p>
          <p>Registered Address: 28 St Pauls Road, Gloucester, Gloucestershire, GL1 5AR</p>
          <p>&copy; {copyrightDate}</p>
        </div>
      </div>
    </footer>
  );
}
