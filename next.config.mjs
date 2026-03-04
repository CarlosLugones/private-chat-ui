/** @type {import('next').NextConfig} */

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' fonts.gstatic.com",
  // data: for identicons, blob: for camera/file previews, https: for OG images
  "img-src 'self' data: blob: https:",
  // ws:/wss: for WebSocket backend
  "connect-src 'self' ws: wss:",
  // YouTube embeds via react-player
  "frame-src https://www.youtube.com https://youtube.com",
  // blob: for camera capture media
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
