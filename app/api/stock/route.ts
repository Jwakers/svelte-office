import { getProductSkus, updateStock } from 'lib/shopify';
import { NextResponse } from 'next/server';
const ftp = require('basic-ftp');
const fs = require('fs');
require('os').tmpdir();

const fetchStockViaFtp = async function () {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.TEKNIK_FTP_HOST,
      user: process.env.TEKNIK_FTP_USER,
      password: process.env.TEKNIK_FTP_PASS
    });
    await client.downloadTo('/tmp/stock.csv', process.env.TEKNIK_FTP_FILENAME);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
  client.close();
};

const getConvertedCSV = async function () {
  await fetchStockViaFtp();
  const csv = fs.readFileSync(`/tmp/stock.csv`);
  const array = csv.toString().split('\r');

  // Remove headers
  array.shift();

  // Convert stock list to object to index easily
  const obj: { [key: string]: number } = {};

  for (const item of array) {
    const [key, val] = item.split(',');
    obj[key.replace(/(\r\n|\n|\r)/gm, '')] = parseInt(val);
  }

  return obj;
};

const handleStockUpdate = async function () {
  const skuList = await getProductSkus();
  const stockList = await getConvertedCSV();

  for (const item of skuList) {
    const stock = stockList[item.sku];
    if (stock === undefined) {
      console.error(`Can not find sku: '${item.sku}' in stock list`);
    } else if (stock !== item.inventoryQuantity) {
      try {
        await updateStock(item.inventoryItemId, stock);
        console.log(`Updated stock of ${item.sku} from ${item.inventoryQuantity} to ${stock}`);
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
      }
    }
  }
  console.log('Stock update complete.');
};

export async function GET(request: Request) {
  try {
    await handleStockUpdate();
    return NextResponse.json('Stock updated', { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
