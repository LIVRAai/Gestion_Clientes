import Link from 'next/link';
import { ReactNode } from 'react';

const links = [
  ['Dashboard', '/dashboard'],
  ['Clientes', '/clientes'],
  ['Pipeline', '/pipeline'],
  ['Recompra', '/recompra'],
  ['Tareas', '/tareas']
];

export default function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-navy text-white p-6 space-y-6">
        <div>
          <p className="text-2xl font-bold">NextUp CRM</p>
          <p className="text-blue-200 text-sm">Ciclo de vida y recompra</p>
        </div>
        <nav className="space-y-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="block px-3 py-2 rounded-lg hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
