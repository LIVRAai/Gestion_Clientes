'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const groups = [
  {
    title: 'Principal',
    items: [
      ['🏠', 'Centro de control', '/dashboard'],
      ['👥', 'Base de clientes', '/clientes'],
      ['🧭', 'Ciclo de vida del cliente', '/pipeline'],
    ],
  },
  {
    title: 'Operación',
    items: [
      ['🧾', 'Compras', '/compras'],
      ['📦', 'Productos', '/productos'],
      ['✅', 'Tareas', '/tareas'],
    ],
  },
  {
    title: 'Crecimiento',
    items: [
      ['⚡', 'Oportunidades de recompra', '/recompra'],
      ['📈', 'Lectura del negocio', '/analitica'],
      ['💬', 'Mensajes', '/mensajes'],
    ],
  },
] as const;

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      <div className="mb-6">
        <p className="text-2xl font-bold">NextUp CRM</p>
        <p className="text-blue-200 text-sm">SaaS de ciclo de vida y recompra</p>
      </div>

      <Link
        href="/clientes"
        onClick={() => setOpen(false)}
        className="btn-primary block text-center mb-6"
      >
        + Nuevo cliente
      </Link>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs uppercase tracking-wider text-blue-200/80 mb-2">
              {group.title}
            </p>

            <nav className="space-y-1">
              {group.items.map(([icon, label, href]) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`nav-link relative flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                      active ? 'bg-white/20 shadow-md' : 'hover:bg-white/10 text-blue-100'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-accent rounded-r"
                      />
                    )}

                    <span>{icon}</span>
                    <span className="text-sm">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen lg:flex page-fade-in">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen w-80 bg-navy/95 backdrop-blur-xl text-white p-6 border-r border-white/10 shadow-2xl">
        {navContent}
      </aside>

      {open && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-navy/95 text-white p-6 backdrop-blur-xl transform transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-blue-100 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="btn-secondary !px-3 !py-1.5 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">NextUp CRM</p>
              <p className="font-semibold text-navy text-sm md:text-base">
                Navegación integrada y accionable
              </p>
            </div>
          </div>

          <span className="badge">Sesión activa</span>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}