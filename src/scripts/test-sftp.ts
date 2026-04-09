import SFTPClient from 'ssh2-sftp-client';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

async function testConnection() {
  const sftp = new SFTPClient();
  const config = {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT || '22'),
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
    readyTimeout: 10000,
    hostKeyCallback: () => true
  };

  console.log(`📡 Connecting to ${config.host} with user ${config.username}...`);

  try {
    await sftp.connect(config);
    console.log('✅ Connection successful!');
    
    const list = await sftp.list('.');
    console.log('📂 File list:');
    console.table(list.map(f => ({ name: f.name, size: f.size, modifyTime: new Date(f.modifyTime).toLocaleString() })));
    
    await sftp.end();
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
