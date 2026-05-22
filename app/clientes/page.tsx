'use client';
import LayoutShell from '@/components/LayoutShell';
import { clientesDemo } from '@/lib/mock';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function ClientesPage() {
  const [q,setQ]=useState(''); const [etapa,setEtapa]=useState('');
  const list = useMemo(()=>clientesDemo.filter(c=>(!q || c.nombre.toLowerCase().includes(q.toLowerCase())) && (!etapa || c.etapa_ciclo_vida===etapa)),[q,etapa]);
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Clientes</h1><div className="flex gap-3"><input className="border rounded p-2" placeholder="Buscar cliente" value={q} onChange={e=>setQ(e.target.value)} /><select className="border rounded p-2" value={etapa} onChange={e=>setEtapa(e.target.value)}><option value="">Todas las etapas</option><option>Atracción</option><option>Profundización</option><option>Fidelización</option><option>Retención</option><option>Recaptura</option></select></div><div className="card overflow-hidden"><table className="w-full text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-left">Nombre</th><th>Etapa</th><th>Estado</th><th>Origen</th><th>Acción</th></tr></thead><tbody>{list.map(c=><tr key={c.id} className="border-t"><td className="p-3">{c.nombre}<p className="text-slate-500">{c.empresa}</p></td><td>{c.etapa_ciclo_vida}</td><td><span className="px-2 py-1 rounded bg-blue-100">{c.estado}</span></td><td>{c.origen}</td><td><Link href={`/clientes/${c.id}`} className="text-accent">Ver</Link></td></tr>)}</tbody></table></div></div></LayoutShell>;
}
