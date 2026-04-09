import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  try {
    const { wait } = await req.json().catch(() => ({ wait: false }));
    const scriptPath = path.join(process.cwd(), 'src/scripts/sync-vehicles.ts');
    
    // Check for existing running process before starting
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: activeSync } = await supabase
      .from('import_logs')
      .select('id')
      .eq('status', 'RUNNING')
      .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .maybeSingle();

    if (activeSync) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ein Import-Prozess läuft bereits im Hintergrund. Bitte warten Sie, bis dieser abgeschlossen ist.' 
      }, { status: 409 });
    }

    const command = `npm run sync-vehicles`;

    if (wait) {
      // Synchronous execution for manual triggers that want immediate feedback
      return await new Promise<Response>((resolve) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error('Sync Script Error:', stderr);
            resolve(NextResponse.json({ success: false, error: stderr || error.message }));
          } else {
            console.log('Sync Script Success:', stdout);
            // The script updates Supabase logs directly, so we just return the success
            resolve(NextResponse.json({ success: true, output: stdout }));
          }
        });
      });
    } else {
      // Trigger in background
      exec(command, (error, stdout, stderr) => {
        if (error) console.error('Background Sync Script Error:', stderr);
        else console.log('Background Sync Script Success:', stdout);
      });

      return NextResponse.json({ 
        message: "Sync gestartet. Der Import läuft im Hintergrund.",
        status: 'accepted',
        success: true
      }, { status: 202 });
    }

  } catch (err: any) {
    console.error('API ERROR:', err.message);
    return NextResponse.json({ 
      success: false,
      message: 'Fehler beim Starten des Imports', 
      error: err.message 
    }, { status: 500 });
  }
}
