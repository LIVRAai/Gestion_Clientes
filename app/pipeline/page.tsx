'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente } from '@/lib/types';
import { etapas } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function PipelinePage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => { (async()=>{const {data}=await supabase.from('clientes').select('*'); setClientes((data??[]) as Cliente[]);})(); }, []);

  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Pipeline del ciclo de vida</h1><p className="text-slate-600">Visualiza y prioriza clientes por etapa comercial.</p><div className="grid md:grid-cols-5 gap-3">{etapas.map(et=> <div key={et} className="card p-3"><p className="font-semibold">{et}</p><div className="space-y-2 mt-3">{clientes.filter(c=>c.etapa_ciclo_vida===et).map(c=><div key={c.id} className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-3 border border-blue-100"><p className="font-medium">{c.nombre}</p><p className="text-xs text-slate-500">{c.estado}</p><p className="text-xs text-slate-500">Próxima acción: seguimiento comercial</p></div>)}{clientes.filter(c=>c.etapa_ciclo_vida===et).length===0 && <p className="text-xs text-slate-400">Sin clientes en esta etapa.</p>}</div></div>)}</div></div></LayoutShell>;
}
