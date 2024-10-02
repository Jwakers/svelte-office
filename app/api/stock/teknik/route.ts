import * as fs from 'fs';
import { VENDORS } from 'lib/constants';
import { getAllPages, getProductSkus, updateStock } from 'lib/shopify';
import { NextResponse } from 'next/server';
import os from 'os';
import Papa from 'papaparse';
import { downloadStockViaFtp } from '../utils';

export const tempDir = os.tmpdir();

export const dynamic = 'force-dynamic'; // Prevents route running during build

const host = process.env.TEKNIK_FTP_HOST,
  user = process.env.TEKNIK_FTP_USER,
  password = process.env.TEKNIK_FTP_PASS;

const handleStockUpdate = async function () {
  if (!host || !user || !password) {
    throw Error('Missing FTP credentials');
  }

  await downloadStockViaFtp({
    dir: tempDir,
    remoteFileName: 'TeknikStockSimple.csv',
    host,
    user,
    password
  });

  const skuList = await getAllPages(
    'variants',
    async (after, vendor) => {
      return await getProductSkus(after, vendor);
    },
    VENDORS.teknik!
  );
  let file;

  try {
    file = await fs.promises.readFile(`${tempDir}/stock.csv`, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${tempDir}/stock.csv:`, error);
    throw error;
  }

  const parseResult = Papa.parse<Record<'Item No' | 'Quantity in Stock', string>>(file, {
    header: true
  });
  const stockList = parseResult.data;

  for (const item of skuList) {
    const stock = stockList.find((stock) => stock['Item No'] === item.sku);
    const quantity = stock ? Number(stock['Quantity in Stock']) : undefined;

    if (!stock || quantity === undefined) {
      console.error(`Can not find sku: '${item.sku}' in stock list`);
      continue;
    }

    if (Number.isNaN(quantity) || quantity === item.inventoryQuantity) continue;

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
    return NextResponse.json('Teknik stock updated', { status: 200 });
  } catch (error) {
    console.error('Stock update failed:', error);
    return NextResponse.json(
      {
        error: 'Stock update failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    fs.promises.unlink(`${tempDir}/stock.csv`);
  }
}
