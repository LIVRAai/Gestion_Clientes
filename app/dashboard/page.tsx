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
  const oportunidades = clientes.filter((c) => ['Seguimiento', 'En riesgo', 'Recaptura'].includes(scoreRecompraPorFecha(ultimaCompraPorCliente(compras, c.id))));

  const kpis = useMemo(() => [
    ['Clientes totales', clientes.length],
    ['Ventas totales', totalVentas],
    ['Valor vendido', `$${valorVendido.toLocaleString('es-CO')}`],
    ['Ticket promedio', `$${ticket.toLocaleString('es-CO')}`],
    ['Clientes en recaptura', recaptura]
  ], [clientes.length, totalVentas, valorVendido, ticket, recaptura]);

  return <LayoutShell><div className="space-y-6">
    <section className="card card-hover p-6 bg-gradient-to-r from-blue-50 to-white">
      <p className="text-sm text-slate-600">Centro de control</p>
      <h1 className="text-3xl font-bold">Gestiona clientes, ventas y recompra desde un solo lugar.</h1>
      <p className="text-slate-600 mt-2">Prioriza relaciones, identifica oportunidades y activa acciones comerciales en minutos.</p>
    </section>

    <section className="grid md:grid-cols-5 gap-3">{kpis.map(([t,v]) => <div key={String(t)} className="card card-hover p-4"><p className="text-xs text-slate-500">{t}</p><p className="text-2xl font-bold mt-1">{v}</p></div>)}</section>

    <section className="grid md:grid-cols-2 gap-4">
      <div className="card p-5"><h2 className="font-semibold mb-3">Próximas acciones sugeridas</h2><ul className="space-y-2 text-sm text-slate-700"><li>• Contactar clientes en riesgo esta semana.</li><li>• Revisar productos con mayor rotación.</li><li>• Programar tareas para clientes sin compra reciente.</li></ul></div>
      <div className="card p-5"><h2 className="font-semibold mb-3">Oportunidades de recompra</h2>{oportunidades.length===0?<p className="text-slate-500 text-sm">Aún no hay oportunidades críticas.</p>:<div className="space-y-2">{oportunidades.slice(0,5).map(c=><div key={c.id} className="rounded-xl border border-blue-100 p-3"><p className="font-medium">{c.nombre}</p><p className="text-xs text-slate-500">Etapa {c.etapa_ciclo_vida} · {scoreRecompraPorFecha(ultimaCompraPorCliente(compras,c.id))}</p></div>)}</div>}</div>
    </section>
  </div></LayoutShell>;
}
