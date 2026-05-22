'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  ['Centro de control', '/dashboard'],
  ['Clientes', '/clientes'],
  ['Productos', '/productos'],
  ['Compras', '/compras'],
  ['Pipeline', '/pipeline'],
  ['Recompra', '/recompra'],
  ['Analítica', '/analitica'],
  ['Tareas', '/tareas']
];

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:flex page-fade-in">
      <aside className="lg:sticky lg:top-0 lg:h-screen w-full lg:w-72 bg-navy text-white p-6 border-r border-white/10">
        <div className="mb-8">
          <p className="text-2xl font-bold">NextUp CRM</p>
          <p className="text-blue-200 text-sm">Gestión comercial simple</p>
        </div>
        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {links.map(([label, href]) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2.5 rounded-xl text-sm nav-link ${
                  isActive ? 'bg-white/20 text-white shadow-md' : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/75 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">NextUp CRM</p>
            <p className="font-semibold text-navy">Plataforma comercial para pymes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge">En línea</span>
            <button className="btn-secondary text-sm">Acción rápida</button>
          </div>
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
