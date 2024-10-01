import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import { VENDORS } from 'lib/constants';
import { getAllPages, getProductSkus, updateStock } from 'lib/shopify';
import { NextResponse } from 'next/server';
import os from 'os';
import Papa from 'papaparse';

const tempDir = os.tmpdir();

export const dynamic = 'force-dynamic'; // Prevents route running during build

const downloadStockViaFtp = async function () {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.DAMS_FTP_HOST,
      user: process.env.DAMS_FTP_USER,
      password: process.env.DAMS_FTP_PASS
    });

    await client.downloadTo(`${tempDir}/stock.csv`, 'stock.csv');
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.close();
  }
};

const handleStockUpdate = async function () {
  await downloadStockViaFtp();
  const skuList = await getAllPages(
    'variants',
    async (after, vendor) => {
      return await getProductSkus(after, vendor);
    },
    VENDORS.dams!
  );
  const file = fs.readFileSync(`${tempDir}/stock.csv`, 'utf-8');
  const parseResult = Papa.parse<Record<'Code' | 'FreeStock' | 'NextSupplyDate', string>>(file, {
    header: true
  });
  const stockList = parseResult.data;

  for (const item of skuList) {
    const stock = stockList.find((stock) => stock.Code === item.sku);
    const quantity = stock ? Number(stock.FreeStock) : undefined;

    if (!stock || quantity === undefined) {
      console.error(`Can not find sku: '${item.sku}' in stock list`);
      continue;
    }

    if (isNaN(quantity) || quantity === item.inventoryQuantity) continue;

    try {
      await updateStock(item.inventoryItemId, quantity);
      console.log(`Updated stock of ${item.sku} from ${item.inventoryQuantity} to ${quantity}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  console.log('Stock update complete.');
};

export async function GET() {
  try {
    await handleStockUpdate();
    return NextResponse.json('Dams stock updated', { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
