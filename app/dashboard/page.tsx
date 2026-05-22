'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { etapas, scoreRecompraPorFecha, ultimaCompraPorCliente } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    (async () => {
      const [c, co] = await Promise.all([supabase.from('clientes').select('*'), supabase.from('compras').select('*')]);
      setClientes((c.data ?? []) as Cliente[]);
      setCompras((co.data ?? []) as Compra[]);
    })();
  }, []);

  const recaptura = clientes.filter((c) => scoreRecompraPorFecha(ultimaCompraPorCliente(compras, c.id)) === 'Recaptura').length;
  const oportunidades = clientes.filter((c) => ['Seguimiento', 'En riesgo', 'Recaptura'].includes(scoreRecompraPorFecha(ultimaCompraPorCliente(compras, c.id)))).length;

  return <LayoutShell><div className="space-y-6"><h1 className="text-3xl font-bold">Dashboard comercial</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[
    ['Total clientes', clientes.length],
    ['Clientes en recaptura', recaptura],
    ['Oportunidades de recompra', oportunidades]
  ].map(([t,v])=><div key={String(t)} className="card p-5"><p className="text-sm text-slate-500">{t}</p><p className="text-3xl font-bold">{v}</p></div>)}</div><div className="card p-6"><h2 className="font-semibold mb-3">Clientes por etapa</h2><div className="grid md:grid-cols-5 gap-3">{etapas.map(e=><div key={e} className="bg-blue-50 rounded-xl p-3"><p>{e}</p><p className="font-bold">{clientes.filter(c=>c.etapa_ciclo_vida===e).length}</p></div>)}</div></div></div></LayoutShell>;
}
