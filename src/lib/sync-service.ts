import Client from 'ssh2-sftp-client';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import AdmZip from 'adm-zip';

if (!process.env.SFTP_HOST) {
  dotenv.config({ path: '.env.local' });
}

import { supabaseAdmin as supabase } from './supabase-admin';

const TEMP_DIR = process.env.VERCEL ? '/tmp/temp_sync' : path.join(process.cwd(), 'temp_sync');
const SFTP_FILENAME = 'wiegand-json-seller-api.zip';

export async function runVehicleSync(existingLogId?: string | number | null) {
  console.log('🚀 Starting Synchronization Service...');
  console.log('📡 SFTP Diagnostics:', {
    host: process.env.SFTP_HOST ? 'Present' : 'MISSING',
    user: process.env.SFTP_USERNAME ? 'Present' : 'MISSING',
    pass: process.env.SFTP_PASSWORD ? `Present (Len: ${process.env.SFTP_PASSWORD.length})` : 'MISSING'
  });
  
  const startTime = Date.now();
  let logId: string | null = existingLogId?.toString() || null;

  // 🔄 Enhanced Safety: If no ID was passed, check if there's already a RUNNING log we should use
  if (!logId) {
    const { data: runningLog } = await supabase
      .from('import_logs')
      .select('id')
      .eq('status', 'RUNNING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (runningLog) {
      logId = runningLog.id;
      console.log(`♻️ Reusing existing RUNNING log: ${logId}`);
    }
  }
  const sftpDebugLogs: string[] = [];
  let sftpPassword = '';

  try {
    // 0. Create or Update Log Entry IMMEDIATELY to provide feedback
    if (logId) {
      // Update existing log immediately to show we started
      await supabase
        .from('import_logs')
        .update({ status: 'RUNNING', details: { message: 'Verarbeitung beginnt...' } })
        .eq('id', logId);
    } else {
      const { data: logEntry, error: logInitialError } = await supabase
        .from('import_logs')
        .insert({
          status: 'RUNNING',
          files_count: 0,
          vehicles_processed: 0,
          details: { message: 'Synchronisation gestartet...' }
        })
        .select('id')
        .single();
      
      if (logInitialError) {
        console.error('❌ Failed to create initial log entry:', logInitialError.message);
      } else {
        logId = logEntry?.id || null;
      }
    }

    if (logId) console.log('📝 Sync Log ID:', logId);

    // 0. Check for existing running sync (Lock) - AFTER creating our log to show we tried
    const { data: activeSync } = await supabase
      .from('import_logs')
      .select('id, created_at')
      .eq('status', 'RUNNING')
      .neq('id', logId || '') // Don't match our own log
      .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .maybeSingle();

    if (activeSync) {
      console.warn('⚠️ A synchronization is already running (started at ' + activeSync.created_at + '). Skipping.');
      if (logId) {
        await supabase.from('import_logs').update({
          status: 'ERROR',
          details: { error: 'Ein anderer Import-Prozess läuft bereits.', active_log_id: activeSync.id }
        }).eq('id', logId);
      }
      return { success: false, error: 'Ein Import-Prozess läuft bereits.' };
    }

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const sftp = new Client();
    
    // Connection with backoff retries
    let connected = false;
    let retries = 0;
    const maxRetries = 3;

    // Clean password from potential literal quotes and whitespace
    sftpPassword = (process.env.SFTP_PASSWORD || '').trim();
    if (sftpPassword.startsWith("'") && sftpPassword.endsWith("'")) sftpPassword = sftpPassword.slice(1, -1);
    else if (sftpPassword.startsWith('"') && sftpPassword.endsWith('"')) sftpPassword = sftpPassword.slice(1, -1);
    
    // HOTFIX: Auto-repair the $9 expansion bug
    if (sftpPassword === 'q1cvMWQ7nt' && sftpPassword.length === 10) {
      console.log('🛠️ Auto-repairing mangled password (restoring missing $9)...');
      sftpPassword = sftpPassword + '$9';
    }
    
    console.log('--- SFTP Connection Diagnostics ---');
    console.log(`Host: ${process.env.SFTP_HOST}`);
    console.log(`User: ${process.env.SFTP_USERNAME}`);
    console.log(`Pass Length: ${sftpPassword.length}`);
    if (sftpPassword.includes('$')) {
      console.warn('⚠️ WARNING: Password contains "$". In .env.local it must likely be escaped as "\\$".');
    }
    console.log('-----------------------------------');

    while (!connected && retries < maxRetries) {
      try {
        console.log(`📡 Connecting to SFTP (Attempt ${retries + 1}/${maxRetries})...`);
        sftpDebugLogs.push(`TRY: Verbindung zu ${process.env.SFTP_HOST}:${process.env.SFTP_PORT || 22} (User: ${process.env.SFTP_USERNAME})`);
        
        await sftp.connect({
          host: process.env.SFTP_HOST,
          port: parseInt(process.env.SFTP_PORT || '22'),
          username: process.env.SFTP_USERNAME,
          password: sftpPassword,
          readyTimeout: 60000,
          tryKeyboard: true, // Support for keyboard-interactive
          debug: (msg: string) => {
            // Quiet mode for production
            if (msg.includes('failure') || msg.includes('Error')) {
              console.log(`[SFTP-DEBUG]: ${msg.replace(/\n/g, ' ')}`);
            }
          },
          algorithms: {
            serverHostKey: ['ssh-rsa', 'ssh-dss', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519'],
            kex: [
              'diffie-hellman-group1-sha1',
              'diffie-hellman-group14-sha1',
              'diffie-hellman-group-exchange-sha1',
              'diffie-hellman-group-exchange-sha256',
              'ecdh-sha2-nistp256',
              'ecdh-sha2-nistp384',
              'ecdh-sha2-nistp521',
              'curve25519-sha256@libssh.org'
            ],
            cipher: [
              'aes128-cbc', 'aes192-cbc', 'aes256-cbc', '3des-cbc',
              'aes128-ctr', 'aes192-ctr', 'aes256-ctr',
              'aes128-gcm@openssh.com', 'aes256-gcm@openssh.com'
            ],
            hmac: [
              'hmac-sha1', 'hmac-sha1-96', 
              'hmac-sha2-256', 'hmac-sha2-512'
            ]
          }
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
      .sort((a, b) => b.size - a.size); // Sort by LARGEST first to get the Full Extract, not a Delta

    console.log('📂 Available ZIP files on server:');
    targetFiles.forEach(f => {
      console.log(`   - ${f.name} (Size: ${(f.size / 1024).toFixed(2)} KB, Modified: ${new Date(f.modifyTime).toISOString()})`);
    });

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

    // 2. Extract using adm-zip (native Node.js, cloud compatible)
    console.log('📦 Extracting data...');
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(TEMP_DIR, true);
    } catch (e: any) {
      throw new Error(`Extraktion fehlgeschlagen: ${e.message}`);
    }

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

    // 4. PRE-SCAN IMAGES (🏎️ Turbo optimization)
    const allFiles = fs.readdirSync(TEMP_DIR);
    console.log(`📸 Pre-scanned ${allFiles.length} image files.`);

    // 4. Process Vehicles
    for (const item of rawData) {
      const ad = item.ad;
      if (!ad) continue;

      const externalId = ad.internalId?.split('/').pop() || ad.vin || Math.random().toString(36).substr(2, 9);
      
      // Explicit delete check
      const action = (item.action || ad.action || item['@action'] || ad.status || item.meta || ad.meta || '').toLowerCase();
      if (action === 'delete' || action === 'remove' || action === 'deleted') {
          const source = ad.meta ? 'ad.meta' : item.meta ? 'item.meta' : ad.status ? 'ad.status' : 'other';
          console.log(`Explicit delete instruction received via ${source} for vehicle: ${externalId}`);
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

      try {
        if (!ad) continue;

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

        // 🖼️ Image Processing
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

        // Extract Year/Month for EZ
        const regValue = ad.firstRegistration || ad.registrationDate || ad.ez || '';
        let ezValue = '';
        if (regValue) {
          const cleanDate = regValue.toString().replace(/[^0-9]/g, '');
          if (cleanDate.length === 8) ezValue = cleanDate;
          else if (cleanDate.length === 6) ezValue = cleanDate + '01';
        }

        // Save to DB
        const vehicleData = {
          external_id: externalId,
          title: title,
          brand: make,
          price: price,
          image: primaryImageUrl,
          status: 'Verfügbar',
          raw_data: {
            ...ad,
            firstRegistration: ezValue || ad.firstRegistration,
            cloud_images: allCloudUrls
          }
        };

        const { error: upsertError } = await supabase
          .from('vehicles')
          .upsert(vehicleData, { onConflict: 'external_id' });

        if (!upsertError) {
          if (existing) updatedCount++;
          else insertedCount++;
          successCount++;
        }

        // 🔄 Update progress for EVERY vehicle (Debug)
        if (logId) {
          await supabase.from('import_logs').update({
            vehicles_processed: successCount,
            inserted_count: insertedCount,
            updated_count: updatedCount,
            details: { 
              message: `Verarbeitung: ${successCount} von ${rawData.length}...`,
              current_vehicle: title
            }
          }).eq('id', logId);
        }

      } catch (loopError: any) {
        console.error(`❌ Error processing vehicle ${externalId}:`, loopError.message);
        continue;
      }
    }

    // 5. Success Logging - Final Update
    if (logId) {
      console.log('✅ Loop complete. Setting final status...');
      const hasChanges = insertedCount > 0 || updatedCount > 0 || deletedCount > 0;
      await supabase.from('import_logs').update({
        status: hasChanges ? 'SUCCESS' : 'UNCHANGED',
        vehicles_processed: successCount,
        inserted_count: insertedCount,
        updated_count: updatedCount,
        deleted_count: deletedCount,
        details: { 
          message: hasChanges ? 'Fahrzeugdaten erfolgreich aktualisiert.' : 'Datenbestand ist bereits aktuell.',
          duration: `${Math.round((Date.now() - startTime) / 1000)}s`
        }
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
    const lastDebugLines = sftpDebugLogs.join(' | ');
    let hint = '';
    
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
