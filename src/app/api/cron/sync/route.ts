import { NextResponse } from 'next/server';
import { runVehicleSync } from '@/lib/sync-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes (Vercel Pro)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Basic security for the cron route
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await runVehicleSync();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
