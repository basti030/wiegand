import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.auto-wiegand.de'; // Basis-URL der Website

  // 1. Statische Routen
  const staticRoutes = [
    '',
    '/unternehmen',
    '/fahrzeuge',
    '/kontakt',
    '/standorte',
    '/karriere',
    '/service',
    '/termin',
    '/angebote',
    '/impressum',
    '/datenschutz',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamische Fahrzeug-Routen aus Supabase laden
  let vehicleRoutes: any[] = [];
  try {
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('external_id, updated_at');

    if (vehicles) {
      vehicleRoutes = vehicles.map((v) => ({
        url: `${baseUrl}/fahrzeuge/${v.external_id}`,
        lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch vehicles:', error);
  }

  return [...staticRoutes, ...vehicleRoutes];
}
