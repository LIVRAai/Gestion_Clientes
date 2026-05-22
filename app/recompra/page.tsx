'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { diasDesde, linkWhatsapp, scoreRecompraPorFecha, sugerenciaWhatsapp, ultimaCompraPorCliente } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function RecompraPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [compras,setCompras]=useState<Compra[]>([]);
  useEffect(()=>{(async()=>{const [c,co]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('compras').select('*')]); setClientes((c.data??[]) as Cliente[]); setCompras((co.data??[]) as Compra[]);})();},[]);
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Oportunidades de recompra</h1><div className="space-y-3">{clientes.map(c=>{const fecha=ultimaCompraPorCliente(compras,c.id);const nivel=scoreRecompraPorFecha(fecha);const potencial=compras.filter(x=>x.cliente_id===c.id).reduce((a,b)=>a+Number(b.valor_total||0),0)*0.35;const msg=sugerenciaWhatsapp(c.etapa_ciclo_vida,c.nombre);return <div key={c.id} className="card p-4 flex justify-between items-center"><div><p className="font-semibold">{c.nombre} <span className="text-xs bg-blue-100 px-2 py-1 rounded">{nivel}</span></p><p className="text-sm text-slate-600">Días desde última compra: {diasDesde(fecha)}</p><p className="text-sm text-slate-600">Valor potencial: ${potencial.toLocaleString('es-CO')}</p></div><a href={linkWhatsapp(c.celular,msg)} className="bg-accent text-white px-4 py-2 rounded-xl">WhatsApp</a></div>})}</div></div></LayoutShell>
}
