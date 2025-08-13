/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизации для Vercel
  poweredByHeader: false,
  compress: true,

  // PWA настройки
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', 'lucide-react', 'd3']
  },

  // Оптимизация для Vercel
  swcMinify: true,

  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ];
  },

  // Перезапись для SPA
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*'
      }
    ];
  }
};

module.exports = nextConfig; 