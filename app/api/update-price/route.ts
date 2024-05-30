import getRestClient from 'lib/shopify/rest/get-rest-client';

const client = getRestClient();

export async function GET() {
  // try {
  //   const variants = await getAllOfType<Variant>('variants');
  //   for (const variant of variants) {
  //     const res = await client.get(`inventory_items/${variant.inventory_item_id}`);
  //     const { inventory_item: inventoryItem }: { inventory_item: InventoryItem } = await res.json();
  //     await wait(500);
  //     if (!inventoryItem) console.log('Inventory item not found', variant.inventory_item_id);
  //     console.log(inventoryItem?.id);
  //     client.put(`variants/${variant.id}`, {
  //       data: {
  //         variant: {
  //           price: getPriceWithMargin(inventoryItem.cost)
  //         }
  //       }
  //     });
  //   }
  //   return Response.json({
  //     message: 'Success'
  //   });
  // } catch (error) {
  //   console.error(JSON.stringify(error, null, 2));
  //   return Response.json({ error: error, status: 500 });
  // }
  return Response.json({
    message: 'Route disabled'
  });
}
