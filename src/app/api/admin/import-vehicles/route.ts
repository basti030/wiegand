import { NextResponse } from 'next/server';
import { runVehicleSync } from '@/lib/sync-service';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  try {
    // Check for existing running process before starting
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

    // Call the sync function directly
    const result = await runVehicleSync();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Synchronisation erfolgreich abgeschlossen.",
        result 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Fehler: ${result.error || 'Unbekannter Fehler während der Synchronisation.'}`,
        error: result.error 
      }, { status: 500 });
    }

  } catch (err: any) {
    console.error('API ERROR:', err.message);
    let hint = '';
    if (err.message.includes('authentication') && process.env.SFTP_PASSWORD?.includes('$')) {
      hint = ' | HINWEIS: Prüfen Sie, ob das "$" im Passwort in der .env.local mit "\\" maskiert ist (z.B. \\$).';
    }
    return NextResponse.json({ 
      success: false,
      message: `Fehler beim Starten: ${err.message}${hint}`, 
      error: err.message 
    }, { status: 500 });
  }
}
