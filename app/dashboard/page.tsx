'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { scoreRecompraPorFecha, ultimaCompraPorCliente } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => { (async () => {
    const [c, co] = await Promise.all([supabase.from('clientes').select('*'), supabase.from('compras').select('*')]);
    setClientes((c.data ?? []) as Cliente[]); setCompras((co.data ?? []) as Compra[]);
  })(); }, []);

  const totalVentas = compras.length;
  const valorVendido = compras.reduce((a, b) => a + Number(b.valor_total || 0), 0);
  const ticket = totalVentas ? valorVendido / totalVentas : 0;
  const recaptura = clientes.filter((c) => scoreRecompraPorFecha(ultimaCompraPorCliente(compras, c.id)) === 'Recaptura').length;
  const riesgo = clientes.filter((c) => scoreRecompraPorFecha(ultimaCompraPorCliente(compras, c.id)) === 'En riesgo').length;

  const kpis = useMemo(() => [
    ['Clientes por etapa', clientes.length],
    ['Recompras recientes', compras.slice(0,7).length],
    ['Clientes en riesgo', riesgo],
    ['Ingresos recuperados', cop(valorVendido * 0.22)],
    ['Ticket promedio', cop(ticket)]
  ], [clientes.length, compras, riesgo, valorVendido, ticket]);

  return <LayoutShell><div className="space-y-6">
    <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="card p-6 bg-gradient-to-r from-blue-50 via-white to-blue-100/40">
      <p className="text-sm text-slate-600">Centro de control</p>
      <h1 className="text-3xl font-bold">Convierte clientes, compras y seguimiento en oportunidades de recompra.</h1>
      <div className="mt-4 flex gap-2"><a href="/clientes" className="btn-primary">Crear cliente</a><a href="/compras" className="btn-secondary">Registrar compra</a><a href="/recompra" className="btn-secondary">Ver recompra</a></div>
    </motion.section>
    <section className="grid md:grid-cols-5 gap-3">{kpis.map(([t,v],i)=><motion.div key={String(t)} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card card-hover p-4"><p className="text-xs text-slate-500">{t}</p><p className="text-2xl font-bold mt-1">{v}</p></motion.div>)}</section>
    <section className="grid md:grid-cols-2 gap-4">
      <div className="card p-5"><h2 className="font-semibold mb-3">Qué hacer ahora</h2><ul className="space-y-2 text-sm text-slate-700"><li>• Contactar clientes con riesgo alto.</li><li>• Activar secuencia de recompra por WhatsApp.</li><li>• Crear tareas para seguimientos vencidos.</li></ul></div>
      <div className="card p-5"><h2 className="font-semibold mb-3">Timeline de actividad reciente</h2>{compras.length===0?<div className="space-y-2"><div className="skeleton h-4 w-2/3"/><div className="skeleton h-4 w-1/2"/></div>:compras.slice(0,5).map(c=><p key={c.id} className="text-sm text-slate-600">Compra registrada {fechaCO(c.fecha_compra)} · {cop(Number(c.valor_total||0))}</p>)}</div>
    </section>
  </div></LayoutShell>;
}
