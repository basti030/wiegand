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

    // Prepare the background sync via GitHub Action
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'basti030';
    const repoName = 'wiegand';
    const workflowId = 'inventory-sync.yml';

    // Create initial log entry
    const { data: logEntry } = await supabase.from('import_logs').insert({
      status: 'PENDING',
      details: { message: 'Sync via GitHub Action angestoßen. Bitte warten...' }
    }).select('id').single();

    const logId = logEntry?.id;

    if (githubToken) {
      console.log('[Trigger] Sending workflow_dispatch to GitHub...');
      const ghResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: { log_id: logId?.toString() }
          }),
        }
      );

      if (ghResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          message: "GitHub-Action gestartet. Der Import läuft jetzt im Hintergrund.",
          status: 'pending',
          logId
        }, { status: 202 });
      }
    }

    // Fallback if no token (keeps old behavior but adds logId)
    runVehicleSync(logId).catch(err => console.error('BG Sync Error:', err.message));
    return NextResponse.json({ success: true, message: 'Sync gestartet (Lokaler Modus).' }, { status: 202 });

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
