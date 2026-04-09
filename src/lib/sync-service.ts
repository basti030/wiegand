import Client from 'ssh2-sftp-client';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

if (!process.env.SFTP_HOST) {
  dotenv.config({ path: '.env.local' });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TEMP_DIR = process.env.VERCEL ? '/tmp/temp_sync' : path.join(process.cwd(), 'temp_sync');
const SFTP_FILENAME = 'wiegand-json-seller-api.zip';

export async function runVehicleSync() {
  console.log('🚀 Starting Synchronization Service...');
  console.log('📡 SFTP Diagnostics:', {
    host: process.env.SFTP_HOST ? 'Present' : 'MISSING',
    user: process.env.SFTP_USERNAME ? 'Present' : 'MISSING',
    pass: process.env.SFTP_PASSWORD ? `Present (Len: ${process.env.SFTP_PASSWORD.length})` : 'MISSING'
  });
  
  const startTime = Date.now();
  let logId: string | null = null;

  try {
    // 0. Check for existing running sync (Lock)
    const { data: activeSync } = await supabase
      .from('import_logs')
      .select('id, created_at')
      .eq('status', 'RUNNING')
      .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .maybeSingle();

    if (activeSync) {
      console.warn('⚠️ A synchronization is already running (started at ' + activeSync.created_at + '). Skipping.');
      return { success: false, error: 'Ein Import-Prozess läuft bereits.' };
    }

    // 0. Create Log Entry
    const { data: logEntry, error: logError } = await supabase
      .from('import_logs')
      .insert({
        status: 'RUNNING',
        files_count: 0,
        vehicles_processed: 0,
        inserted_count: 0,
        updated_count: 0,
        deleted_count: 0,
        errors_count: 0
      })
      .select('id')
      .single();
    
    if (logError) {
      console.error('❌ Failed to create log entry:', logError.message);
    }
    
    logId = logEntry?.id || null;
    console.log('📝 Sync Log ID:', logId);

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEMP_DIR);

    const sftp = new Client();
    
    // Connection with backoff retries
    let connected = false;
    let retries = 0;
    const maxRetries = 3;

    // Clean password from potential literal quotes
    let sftpPassword = process.env.SFTP_PASSWORD || '';
    if (sftpPassword.startsWith("'") && sftpPassword.endsWith("'")) sftpPassword = sftpPassword.slice(1, -1);
    else if (sftpPassword.startsWith('"') && sftpPassword.endsWith('"')) sftpPassword = sftpPassword.slice(1, -1);
    
    while (!connected && retries < maxRetries) {
      try {
        console.log(`📡 Connecting to SFTP (Attempt ${retries + 1}/${maxRetries})...`);
        await sftp.connect({
          host: process.env.SFTP_HOST,
          port: parseInt(process.env.SFTP_PORT || '22'),
          username: process.env.SFTP_USERNAME,
          password: sftpPassword,
          // Removed manual algorithm configuration to let ssh2 negotiate best compatibility
          readyTimeout: 30000
        });
        connected = true;
        console.log('✅ SFTP Connected.');
      } catch (connErr: any) {
        retries++;
        console.error(`⚠️ Connection attempt ${retries} failed:`, connErr.message);
        if (retries < maxRetries) {
          const waitTime = Math.pow(2, retries) * 1000;
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw connErr;
        }
      }
    }
    
    console.log('📥 Searching for newest data file...');
    let files: any[] = [];
    let searchedPath = '.';
    
    try {
      const realPath = await sftp.realPath('.');
      console.log(`🏠 Absolute SFTP Path: ${realPath}`);
    } catch (e) {
      console.warn('⚠️ Could not determine realpath');
    }

    try {
      files = await sftp.list('.');
      console.log(`📂 Found ${files.length} items in '.'`);
    } catch (e: any) {
      console.warn(`⚠️ Could not list "." directory: ${e.message}`);
    }

    // Try root if '.' is empty
    const hasWiegand = (list: any[]) => list.some(f => f.name.toLowerCase().startsWith('wiegand') && f.name.toLowerCase().endsWith('.zip'));

    if (files.length === 0 || !hasWiegand(files)) {
      try {
        const rootFiles = await sftp.list('/');
        console.log(`📂 Found ${rootFiles.length} items in '/'`);
        if (hasWiegand(rootFiles)) {
          files = rootFiles;
          searchedPath = '/';
        }
      } catch (e: any) {
        console.warn(`⚠️ Could not list "/" directory: ${e.message}`);
      }
    }
    
    // If STILL empty, try common subdirectories or direct check
    if (files.length === 0 && !hasWiegand(files)) {
       const commonDirs = ['/out', '/export', '/data', '/wiegand'];
       for (const dir of commonDirs) {
          try {
             const dirFiles = await sftp.list(dir);
             console.log(`📂 Found ${dirFiles.length} items in '${dir}'`);
             if (hasWiegand(dirFiles)) {
                files = dirFiles;
                searchedPath = dir;
                break;
             }
          } catch (e) {}
       }
    }

    // Find files starting with 'wiegand' and ending with '.zip'
    const targetFiles = files
      .filter(f => f.name.toLowerCase().startsWith('wiegand') && f.name.toLowerCase().endsWith('.zip'))
      .sort((a, b) => b.modifyTime - a.modifyTime); // Sort by most recent

    if (targetFiles.length === 0) {
      // LAST RESORT: Check if the exact filename exists directly if listing fails
      try {
        const exists = await sftp.exists('wiegand-json-seller-api.zip');
        if (exists) {
          console.log('🎯 Found file via direct check (wiegand-json-seller-api.zip)');
          targetFiles.push({ name: 'wiegand-json-seller-api.zip' });
        }
      } catch (e) {}
    }

    if (targetFiles.length === 0) {
      const filePreview = files.slice(0, 15).map(f => f.name).join(', ');
      const suffix = files.length > 15 ? '...' : '';
      throw new Error(`Keine Datei im Pfad "${searchedPath}" gefunden. Verfügbar: ${filePreview}${suffix} (Typ: ${files.length})`);
    }

    const targetFilename = targetFiles[0].name;
    const remotePath = searchedPath === '.' ? targetFilename : (searchedPath.endsWith('/') ? `${searchedPath}${targetFilename}` : `${searchedPath}/${targetFilename}`);
    console.log(`✅ Found target file: ${targetFilename} in ${searchedPath}`);

    const zipPath = path.join(TEMP_DIR, targetFilename);
    await sftp.fastGet(remotePath, zipPath);
    await sftp.end();

    // 2. Extract using system unzip
    console.log('📦 Extracting data...');
    execSync(`unzip -o "${zipPath}" -d "${TEMP_DIR}"`, { stdio: 'inherit' });

    // 3. Parse JSON
    const jsonPath = path.join(TEMP_DIR, 'wiegand-json-seller-api.json');
    if (!fs.existsSync(jsonPath)) throw new Error('JSON file not found in ZIP');
    
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📊 Found ${rawData.length} vehicles in JSON.`);

    let successCount = 0;
    let imageCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;

    // 4. Process Vehicles
    for (const item of rawData) {
      const ad = item.ad;
      if (!ad) continue;

      const externalId = ad.internalId?.split('/').pop() || ad.vin || Math.random().toString(36).substr(2, 9);
      
      // Explicit delete check
      const action = (item.action || ad.action || item['@action'] || ad.status || '').toLowerCase();
      if (action === 'delete' || action === 'remove' || action === 'deleted') {
          console.log(`Explicit delete instruction received for vehicle: ${externalId}`);
          try {
              // A. Storage Cleanup
              const { data: files } = await supabase.storage.from('vehicle-images').list(externalId);
              if (files && files.length > 0) {
                  const paths = files.map(f => `${externalId}/${f.name}`);
                  await supabase.storage.from('vehicle-images').remove(paths);
              }
              // B. Database Deletion
              await supabase.from('vehicles').delete().eq('external_id', externalId);
              deletedCount++;
          } catch (err: any) {
              console.error(`Explicit delete failed for ${externalId}:`, err.message);
          }
          continue;
      }

      const make = ad.make || '';
      const model = ad.model || '';
      let title = `${make} ${model}`.trim();
      
      if (!title) {
        title = ad.title || 'Fahrzeug ohne Titel';
      }
      
      const priceValue = ad.price?.consumerPriceGross;
      const price = priceValue 
        ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(priceValue)
        : 'Auf Anfrage';

      // Implicit image mapping: [ID]_xx.jpg
      const allFiles = fs.readdirSync(TEMP_DIR);
      const imageFiles = allFiles
        .filter(f => f.startsWith(`${externalId}_`) && f.toLowerCase().endsWith('.jpg'))
        .sort();
      
      let primaryImageUrl = '';
      const allCloudUrls: string[] = [];

      for (const imgName of imageFiles) {
        const localImgPath = path.join(TEMP_DIR, imgName);
        if (fs.existsSync(localImgPath)) {
          const fileBuffer = fs.readFileSync(localImgPath);
          const cloudPath = `${externalId}/${imgName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('vehicle-images')
            .upload(cloudPath, fileBuffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('vehicle-images')
              .getPublicUrl(cloudPath);
            
            if (!primaryImageUrl) primaryImageUrl = publicUrl;
            allCloudUrls.push(publicUrl);
            imageCount++;
          }
        }
      }

      // Check if exists for stats
      const { data: existing } = await supabase
        .from('vehicles')
        .select('id')
        .eq('external_id', externalId)
        .maybeSingle();

      // Update Database
      const vehicleData = {
        external_id: externalId,
        title: title,
        brand: make,
        price: price,
        image: primaryImageUrl,
        status: 'Verfügbar',
        raw_data: {
          ...ad,
          cloud_images: allCloudUrls
        }
      };

      const { error: upsertError } = await supabase
        .from('vehicles')
        .upsert(vehicleData, { onConflict: 'external_id' });

      if (!upsertError) {
        successCount++;
        if (existing) updatedCount++; else insertedCount++;
      }
    }

    // 5. Success Logging
    if (logId) {
      await supabase.from('import_logs').update({
        status: 'SUCCESS',
        files_count: 1,
        vehicles_processed: successCount,
        inserted_count: insertedCount,
        updated_count: updatedCount,
        deleted_count: deletedCount,
        details: { duration_ms: Date.now() - startTime }
      }).eq('id', logId);
    }

    return {
      success: true,
      vehiclesProcessed: rawData.length,
      vehiclesSynced: successCount,
      imagesUploaded: imageCount
    };

  } catch (err: any) {
    console.error('💥 Sync Service failed:', err.message);
    
    if (logId) {
      await supabase.from('import_logs').update({
        status: 'ERROR',
        details: { error: err.message, duration_ms: Date.now() - startTime }
      }).eq('id', logId);
    }

    return { success: false, error: err.message };
  } finally {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  }
}
