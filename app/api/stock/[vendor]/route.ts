import verifyVercelCron from '@/lib/verify-vercel-cron';
import * as fs from 'fs';
import { TAGS, VENDORS } from 'lib/constants';
import { getAllPages, getProductSkus, updateStock } from 'lib/shopify';
import { InventoryItem } from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import Papa from 'papaparse';
import { downloadStockViaFtp } from '../utils';

export const dynamic = 'force-dynamic'; // Prevents route running during build

const tempDir = os.tmpdir();

interface VendorConfig {
  ftpHost: string;
  ftpUser: string;
  ftpPass: string;
  remoteFileName: string;
  csvSkuColumnName: string;
  csvSkuQuantityColumnName: string;
  vendorKey: keyof typeof VENDORS;
}

const vendorConfigs: Record<string, VendorConfig> = {
  teknik: {
    ftpHost: process.env.TEKNIK_FTP_HOST!,
    ftpUser: process.env.TEKNIK_FTP_USER!,
    ftpPass: process.env.TEKNIK_FTP_PASS!,
    remoteFileName: 'TeknikStockSimple.csv',
    csvSkuColumnName: 'Item No',
    csvSkuQuantityColumnName: 'Quantity in Stock',
    vendorKey: 'teknik'
  },
  dams: {
    ftpHost: process.env.DAMS_FTP_HOST!,
    ftpUser: process.env.DAMS_FTP_USER!,
    ftpPass: process.env.DAMS_FTP_PASS!,
    remoteFileName: 'stock.csv',
    csvSkuColumnName: 'Code',
    csvSkuQuantityColumnName: 'FreeStock',
    vendorKey: 'dams'
  }
};

const downloadStock = async (config: VendorConfig) => {
  if (!config.ftpHost || !config.ftpUser || !config.ftpPass) {
    throw new Error('Missing FTP credentials');
  }
  await downloadStockViaFtp({
    dir: tempDir,
    remoteFileName: config.remoteFileName,
    host: config.ftpHost,
    user: config.ftpUser,
    password: config.ftpPass
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
  return Papa.parse<Record<string, string>>(file, {
    header: true
  }).data;
};

const updateStockItem = async (
  config: VendorConfig,
  item: InventoryItem,
  stockList: Record<string, string>[]
) => {
  const stock = stockList.find((stock) => stock[config.csvSkuColumnName] === item.sku);
  const quantity = stock ? Number(stock[config.csvSkuQuantityColumnName]) : 0;

  if (!stock) {
    console.warn(`Cannot find sku: '${item.sku}' in stock list`);
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

const handleStockUpdate = async function (config: VendorConfig) {
  try {
    await downloadStock(config);
    const skuList = await getAllPages(
      'variants',
      async (after, vendor) => await getProductSkus(after, vendor),
      VENDORS[config.vendorKey]!
    );
    const file = await readStockFile();
    const stockList = parseStockData(file);

    for (const item of skuList) {
      await updateStockItem(config, item, stockList);
    }
    console.log('Stock update complete.');
  } catch (error) {
    console.error('Stock update failed:', error);
    throw error;
  } finally {
    await fs.promises.unlink(`${tempDir}/stock.csv`).catch(console.error);
    revalidateTag(TAGS.products);
  }
};

export async function GET(req: NextRequest, { params }: { params: { vendor: string } }) {
  verifyVercelCron(req);

  const { vendor } = params;
  const config = vendorConfigs[vendor.toLowerCase()];

  if (!config) {
    return NextResponse.json({ error: `Invalid vendor: ${vendor}` }, { status: 400 });
  }

  try {
    await handleStockUpdate(config);
    return NextResponse.json(`${vendor} stock updated`, { status: 200 });
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
