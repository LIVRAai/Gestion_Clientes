'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra } from '@/lib/types';
import { diasDesde, linkWhatsapp, sugerenciaWhatsapp, ultimaCompraPorCliente } from '@/lib/utils';
import { calcularLifecycle } from '@/lib/lifecycle';
import { cop } from '@/lib/format';
import { MENSAJES_DEFAULT, renderMensaje } from '@/lib/messages';
import { useEffect, useState } from 'react';

export default function RecompraPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [compras,setCompras]=useState<Compra[]>([]); const [mensajes,setMensajes]=useState<Record<string,string>>({});
  useEffect(()=>{(async()=>{const [c,co,m]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('compras').select('*'),supabase.from('mensajes_etapa').select('*')]); setClientes((c.data??[]) as Cliente[]); setCompras((co.data??[]) as Compra[]); const mm:any={}; (m.data??[]).forEach((x:any)=>mm[x.etapa]=x.mensaje); setMensajes(mm);})();},[]);
  return <LayoutShell><div className="space-y-4"><h1 className="text-2xl md:text-3xl font-bold">Oportunidades de recompra</h1><p className="text-slate-600">Prioriza clientes urgentes y activa mensajes comerciales sugeridos.</p><div className="space-y-3">{[...clientes].sort((a,b)=>diasDesde(ultimaCompraPorCliente(compras,b.id))-diasDesde(ultimaCompraPorCliente(compras,a.id))).map(c=>{const fecha=ultimaCompraPorCliente(compras,c.id);const auto=calcularLifecycle(c,compras); const nivel=auto.etapa_ciclo_vida;const potencial=compras.filter(x=>x.cliente_id===c.id).reduce((a,b)=>a+Number(b.valor_total||0),0)*0.35;const template = mensajes[auto.etapa_ciclo_vida] || MENSAJES_DEFAULT[auto.etapa_ciclo_vida]; const msg=renderMensaje(template,{nombre:c.nombre,empresa:c.empresa,etapa:auto.etapa_ciclo_vida,ultima_compra:fecha,valor_total:auto.valor_total_cliente,dias_sin_compra:auto.dias_desde_ultima_compra});return <div key={c.id} className="card card-hover p-4 flex justify-between items-center"><div><p className="font-semibold">{c.nombre} <span className="badge">{nivel}</span></p><p className="text-sm text-slate-600">Días sin compra: {diasDesde(fecha)}</p><p className="text-sm text-slate-600">Valor potencial: {cop(potencial)}</p><p className="text-xs text-slate-500 mt-1">Mensaje sugerido: {msg}</p></div><a href={linkWhatsapp(c.celular,msg)} className="btn-primary">WhatsApp</a></div>})}</div></div></LayoutShell>
}
