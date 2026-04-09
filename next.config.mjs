/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.auto-wiegand.de',
      },
      {
        protocol: 'https',
        hostname: 'dsubxqeajfxsrygxsikj.supabase.co',
      },
    ],
  },
  serverExternalPackages: ['ssh2-sftp-client', 'ssh2'],
};

export default nextConfig;
