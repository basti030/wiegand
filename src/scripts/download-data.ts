import Client from 'ssh2-sftp-client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

async function downloadData() {
  const sftp = new Client();
  const config = {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT || '22'),
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  };

  const remoteFile = 'wiegand-json-seller-api.zip';
  const localFile = path.join(process.cwd(), 'temp_data.zip');

  try {
    console.log(`📡 Connecting to ${config.host}...`);
    await sftp.connect(config);
    console.log(`✅ Connection successful!`);

    console.log(`📥 Downloading ${remoteFile}...`);
    await sftp.fastGet(remoteFile, localFile);
    console.log(`✅ Download complete: ${localFile}`);

    await sftp.end();
  } catch (err: any) {
    console.error('❌ Strategy failed:', err.message);
    process.exit(1);
  }
}

downloadData();
