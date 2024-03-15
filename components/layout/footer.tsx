import Link from 'next/link';

import { Logo } from 'components/logo';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const menu = await getMenu('footer');

  return (
    <footer className="border-t border-brand bg-white pb-11 md:pb-0">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 gap-8 border-b border-brand py-12 transition-colors duration-150 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-3">
            <a className="flex flex-initial items-center font-serif font-bold md:mr-24" href="/">
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
        </div>
        <div className="flex flex-col pb-10 pt-6 text-xs">
          <p>&copy; {copyrightDate} by Wakeham Retail LTD. All rights reserved.</p>
          <p>Company Reg No: 15004801</p>
          <p>Registered Address: 28 St Pauls Road, Gloucester, Gloucestershire, GL1 5AR</p>
        </div>
      </div>
    </footer>
  );
}
