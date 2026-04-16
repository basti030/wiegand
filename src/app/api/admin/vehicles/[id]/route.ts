import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID erforderlich' }, { status: 400 });
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Fahrzeug erfolgreich gelöscht' 
    });

  } catch (err: any) {
    console.error('DELETE ERROR:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: 'Fehler beim Löschen des Fahrzeugs', 
      error: err.message 
    }, { status: 500 });
  }
}
