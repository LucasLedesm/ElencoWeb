/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 es un módulo nativo (binario .node). Si Next.js intenta
  // empaquetarlo con webpack para las funciones serverless, puede fallar
  // silenciosamente en producción (funciona en local, pero en Vercel las
  // consultas no devuelven nada o tiran error). Esto le dice a Next que
  // lo deje como dependencia externa de Node y no lo toque.
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },

  // Headers de seguridad recomendados a nivel de aplicación
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
