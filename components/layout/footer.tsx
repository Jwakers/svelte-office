import Link from 'next/link';

import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';

const { SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const menu = await getMenu('next-js-frontend-footer-menu');

  return (
    <footer className="border-t border-gray-700 bg-stone-50 text-black dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-gray-700 py-12 transition-colors duration-150 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-3">
            <a className="flex flex-initial items-center font-bold md:mr-24" href="/">
              <span className="mr-2">
                <span>logo</span>
              </span>
              <span>{SITE_NAME}</span>
            </a>
          </div>
          {menu.length ? (
            <nav className="col-span-1 lg:col-span-7">
              <ul className="grid md:grid-flow-col md:grid-cols-3 md:grid-rows-4">
                {menu.map((item: Menu) => (
                  <li key={item.title} className="py-3 md:py-0 md:pb-4">
                    <Link
                      href={item.path}
                      className="text-gray-800 transition duration-150 ease-in-out hover:text-gray-300 dark:text-gray-100"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className="flex flex-col items-center justify-between space-y-4 pb-10 pt-6 text-sm md:flex-row">
          <p>
            &copy; {copyrightDate} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
