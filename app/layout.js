import './globals.css';

export const metadata = {
  title: 'Consulta Equipos MT',
  description: 'Consulta rápida de equipos de media tensión',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
