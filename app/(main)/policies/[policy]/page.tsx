import Prose from 'components/prose';
import { getPolicies } from 'lib/shopify';
import { notFound } from 'next/navigation';

export default async function PolicyPage({ params }: { params: { policy: string } }) {
  const policies = await getPolicies();
  var camelCased = params.policy.replace(/-([a-z])/g, (g) => (g[1] ? g[1].toUpperCase() : ''));

  const data = policies[camelCased];
  if (data === undefined) notFound();

  return (
    <section className="mx-auto h-full w-full border-brand p-3 md:max-w-3xl md:border-l md:border-r">
      <h1 className="mb-4 font-serif text-3xl">{data.title}</h1>
      <Prose html={data.body} />
    </section>
  );
}
