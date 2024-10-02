import * as ftp from 'basic-ftp';

export const downloadStockViaFtp = async function ({
  dir,
  remoteFileName,
  host,
  user,
  password
}: Record<'dir' | 'remoteFileName' | 'host' | 'user' | 'password', string>): Promise<string> {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';
  const filePath = `${dir}/stock.csv`;

  try {
    await client.access({ host, user, password });

    await client.downloadTo(filePath, remoteFileName);
    return filePath;
  } catch (error) {
    console.error('FTP download failed:', error);
    throw new Error('Failed to download stock file via FTP');
  } finally {
    client.close();
  }
};
