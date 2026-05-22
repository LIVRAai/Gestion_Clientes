'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { diasDesde, linkWhatsapp, scoreRecompraPorFecha, sugerenciaWhatsapp, ultimaCompraPorCliente } from '@/lib/utils';
import { cop } from '@/lib/format';
import { useEffect, useState } from 'react';

export default function RecompraPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [compras,setCompras]=useState<Compra[]>([]);
  useEffect(()=>{(async()=>{const [c,co]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('compras').select('*')]); setClientes((c.data??[]) as Cliente[]); setCompras((co.data??[]) as Compra[]);})();},[]);
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Oportunidades de recompra</h1><p className="text-slate-600">Prioriza clientes urgentes y activa mensajes comerciales sugeridos.</p><div className="space-y-3">{[...clientes].sort((a,b)=>diasDesde(ultimaCompraPorCliente(compras,b.id))-diasDesde(ultimaCompraPorCliente(compras,a.id))).map(c=>{const fecha=ultimaCompraPorCliente(compras,c.id);const nivel=scoreRecompraPorFecha(fecha);const potencial=compras.filter(x=>x.cliente_id===c.id).reduce((a,b)=>a+Number(b.valor_total||0),0)*0.35;const msg=sugerenciaWhatsapp(c.etapa_ciclo_vida,c.nombre);return <div key={c.id} className="card card-hover p-4 flex justify-between items-center"><div><p className="font-semibold">{c.nombre} <span className="badge">{nivel}</span></p><p className="text-sm text-slate-600">Días sin compra: {diasDesde(fecha)}</p><p className="text-sm text-slate-600">Valor potencial: {cop(potencial)}</p><p className="text-xs text-slate-500 mt-1">Mensaje sugerido: {msg}</p></div><a href={linkWhatsapp(c.celular,msg)} className="btn-primary">WhatsApp</a></div>})}</div></div></LayoutShell>
}
