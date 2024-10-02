import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';

type FtpInput = Record<'dir' | 'remoteFileName' | 'host' | 'user' | 'password', string>;

function validateInput(input: FtpInput) {
  // Prevent path traversal
  if (input.dir.includes('..')) {
    throw new Error('Invalid directory path');
  }

  if (input.remoteFileName.includes('..')) {
    throw new Error('Invalid remote file name');
  }
}

export const downloadStockViaFtp = async function ({
  dir,
  remoteFileName,
  host,
  user,
  password
}: FtpInput): Promise<string> {
  validateInput({ dir, remoteFileName, host, user, password });

  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';
  const filePath = path.join(dir, 'stock.csv');

  try {
    await client.access({ host, user, password });
    await client.downloadTo(filePath, remoteFileName);

    // Check the file exist locally
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return filePath;
    } catch {
      throw new Error('Failed to download stock file via FTP');
    }
  } catch (error) {
    console.error('FTP download failed:', error);
    throw new Error(`Failed to download stock file via FTP: ${error}`);
  } finally {
    client.close();
  }
};
