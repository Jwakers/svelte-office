import { getProducts } from 'lib/shopify';
import ProductTile from './product-tile';

export default async function LatestProducts() {
  const products = await getProducts({ limit: 4, sortKey: 'CREATED_AT', reverse: true });

  return (
    <div className="md:grid md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductTile product={product} />
      ))}
    </div>
  );
}
