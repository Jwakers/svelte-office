import Prose from 'components/prose';
import { getPolicies } from 'lib/shopify';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Policies',
  description:
    'Review the policies of Svelte Office. Learn about our shipping, returns, privacy, and terms of service to ensure a seamless shopping experience for premium office furniture.'
};

export default async function PolicyPage({ params }: { params: { policy: string } }) {
  const policies = await getPolicies();
  var camelCased = params.policy.replace(/-([a-z])/g, (g) => (g[1] ? g[1].toUpperCase() : ''));

  const data = policies[camelCased];
  if (data === undefined) notFound();

  return (
    <section className="mx-auto h-full w-full animate-fadeIn border-brand p-3 md:max-w-3xl md:border-l md:border-r">
      <h1 className="mb-4 font-serif text-3xl">{data.title}</h1>
      <Prose html={data.body} />
    </section>
  );
}
