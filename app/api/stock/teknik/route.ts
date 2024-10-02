import * as fs from 'fs';
import { VENDORS } from 'lib/constants';
import { getAllPages, getProductSkus, updateStock } from 'lib/shopify';
import { NextResponse } from 'next/server';
import os from 'os';
import Papa from 'papaparse';
import { downloadStockViaFtp } from '../utils';

export const dynamic = 'force-dynamic'; // Prevents route running during build

const tempDir = os.tmpdir();
const host = process.env.TEKNIK_FTP_HOST,
  user = process.env.TEKNIK_FTP_USER,
  password = process.env.TEKNIK_FTP_PASS;

const downloadStock = async () => {
  if (!host || !user || !password) {
    throw new Error('Missing FTP credentials');
  }
  await downloadStockViaFtp({
    dir: tempDir,
    remoteFileName: 'TeknikStockSimple.csv',
    host,
    user,
    password
  });
};

const readStockFile = async () => {
  try {
    return await fs.promises.readFile(`${tempDir}/stock.csv`, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${tempDir}/stock.csv:`, error);
    throw error;
  }
};

const parseStockData = (file: string) => {
  return Papa.parse<Record<'Item No' | 'Quantity in Stock', string>>(file, {
    header: true
  }).data;
};

const updateStockItem = async (item: any, stockList: any[]) => {
  const stock = stockList.find((stock) => stock['Item No'] === item.sku);
  const quantity = stock ? Number(stock['Quantity in Stock']) : undefined;

  if (!stock || quantity === undefined) {
    console.warn(`Cannot find sku: '${item.sku}' in stock list`);
    return;
  }

  if (Number.isNaN(quantity) || quantity === item.inventoryQuantity) return;

  try {
    await updateStock(item.inventoryItemId, quantity);
    console.log(`Updated stock of ${item.sku} from ${item.inventoryQuantity} to ${quantity}`);
  } catch (error) {
    console.error(`Failed to update stock for ${item.sku}:`, error);
    throw error;
  }
};

const handleStockUpdate = async function () {
  try {
    await downloadStock();
    const skuList = await getAllPages(
      'variants',
      async (after, vendor) => await getProductSkus(after, vendor),
      VENDORS.teknik!
    );
    const file = await readStockFile();
    const stockList = parseStockData(file);

    for (const item of skuList) {
      await updateStockItem(item, stockList);
    }
    console.log('Stock update complete.');
  } catch (error) {
    console.error('Stock update failed:', error);
    throw error;
  } finally {
    await fs.promises.unlink(`${tempDir}/stock.csv`).catch(console.error);
  }
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
  }
}
