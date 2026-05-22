'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const groups = [
  { title: 'Principal', items: [['🏠', 'Centro de control', '/dashboard'], ['👥', 'Base de clientes', '/clientes'], ['🧭', 'Ciclo de vida del cliente', '/pipeline']] },
  { title: 'Operación', items: [['🧾', 'Compras', '/compras'], ['📦', 'Productos', '/productos'], ['✅', 'Tareas', '/tareas']] },
  { title: 'Crecimiento', items: [['⚡', 'Oportunidades de recompra', '/recompra'], ['📈', 'Lectura del negocio', '/analitica']] }
] as const;

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen lg:flex page-fade-in">
      <aside className="lg:sticky lg:top-0 lg:h-screen w-full lg:w-80 bg-navy/95 backdrop-blur-xl text-white p-6 border-r border-white/10 shadow-2xl">
        <div className="mb-6"><p className="text-2xl font-bold">NextUp CRM</p><p className="text-blue-200 text-sm">SaaS de ciclo de vida y recompra</p></div>
        <Link href="/clientes" className="btn-primary block text-center mb-6">+ Nuevo cliente</Link>
        <div className="space-y-6">{groups.map((g) => <div key={g.title}><p className="text-xs uppercase tracking-wider text-blue-200/80 mb-2">{g.title}</p><nav className="space-y-1">{g.items.map(([icon,label,href])=>{const active = pathname===href || pathname.startsWith(`${href}/`);return <Link key={href} href={href} className={`nav-link relative flex items-center gap-3 px-3 py-2.5 rounded-xl ${active?'bg-white/20 shadow-md':'hover:bg-white/10 text-blue-100'}`}>{active&&<motion.span layoutId="active-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-accent rounded-r"/>}<span>{icon}</span><span className="text-sm">{label}</span></Link>})}</nav></div>)}</div>
      </aside>
      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm"><div><p className="text-xs uppercase tracking-wide text-slate-500">NextUp CRM</p><p className="font-semibold text-navy">Navegación integrada y accionable</p></div><span className="badge">Sesión activa</span></header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
