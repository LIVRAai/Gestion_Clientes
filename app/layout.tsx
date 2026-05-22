import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NextUp CRM',
  description: 'CRM moderno para pymes enfocado en ciclo de vida y recompra'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
