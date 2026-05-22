'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { calcularLifecycle } from '@/lib/lifecycle';
import { etapas } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function PipelinePage() {
  const [clientes, setClientes] = useState<Cliente[]>([]); const [compras, setCompras]=useState<Compra[]>([]);
  useEffect(() => { (async()=>{const [c,co]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('compras').select('*')]); setClientes((c.data??[]) as Cliente[]); setCompras((co.data??[]) as Compra[]);})(); }, []);

  return <LayoutShell><div className="space-y-4"><h1 className="text-2xl md:text-3xl font-bold">Ciclo de vida del cliente</h1><p className="text-slate-600">Visualiza y prioriza clientes por etapa comercial.</p><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">{etapas.map(et=> <div key={et} className="card p-3"><p className="font-semibold">{et}</p><div className="space-y-2 mt-3">{clientes.filter(c=>calcularLifecycle(c,compras).etapa_ciclo_vida===et).map(c=><div key={c.id} className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-3 border border-blue-100"><p className="font-medium">{c.nombre}</p><p className="text-xs text-slate-500">{calcularLifecycle(c,compras).estado}</p><p className="text-xs text-slate-500">Próxima acción: {calcularLifecycle(c,compras).proxima_accion_sugerida}</p></div>)}{clientes.filter(c=>calcularLifecycle(c,compras).etapa_ciclo_vida===et).length===0 && <p className="text-xs text-slate-400">Sin clientes en esta etapa.</p>}</div></div>)}</div></div></LayoutShell>;
}
