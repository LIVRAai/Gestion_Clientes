'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Producto } from '@/lib/types';
import { scoreRecompraPorFecha, ultimaCompraPorCliente } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

export default function AnaliticaPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [compras,setCompras]=useState<Compra[]>([]); const [productos,setProductos]=useState<Producto[]>([]);
  useEffect(()=>{(async()=>{const [c,co,p]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('compras').select('*'),supabase.from('productos').select('*')]); setClientes((c.data??[]) as Cliente[]); setCompras((co.data??[]) as Compra[]); setProductos((p.data??[]) as Producto[]);})();},[]);
  const totalVentas = compras.length;
  const valorTotal = compras.reduce((a,c)=>a+Number(c.valor_total||0),0);
  const ticketProm = totalVentas ? valorTotal/totalVentas : 0;
  const topProductos = useMemo(()=>Object.entries(compras.reduce((acc:any,c)=>{acc[c.producto_id]=(acc[c.producto_id]||0)+c.cantidad; return acc;},{})).sort((a:any,b:any)=>b[1]-a[1]).slice(0,5),[compras]);
  const topClientes = useMemo(()=>Object.entries(compras.reduce((acc:any,c)=>{acc[c.cliente_id]=(acc[c.cliente_id]||0)+Number(c.valor_total||0); return acc;},{})).sort((a:any,b:any)=>b[1]-a[1]).slice(0,5),[compras]);
  const recaptura = clientes.filter(c=>scoreRecompraPorFecha(ultimaCompraPorCliente(compras,c.id))==='Recaptura');
  const sinReciente = clientes.filter(c=>['En riesgo','Recaptura'].includes(scoreRecompraPorFecha(ultimaCompraPorCliente(compras,c.id))));
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Analítica comercial</h1><div className="grid md:grid-cols-4 gap-3">{[['Total clientes',clientes.length],['Total ventas',totalVentas],['Valor total vendido',`$${valorTotal.toLocaleString('es-CO')}`],['Ticket promedio',`$${ticketProm.toLocaleString('es-CO')}`]].map(([t,v])=><div key={String(t)} className="card p-4"><p className="text-sm text-slate-500">{t}</p><p className="text-2xl font-bold">{v}</p></div>)}</div><div className="grid md:grid-cols-2 gap-4"><div className="card p-4"><h2 className="font-semibold mb-2">Productos más vendidos</h2>{topProductos.map(([id,c])=><p key={String(id)}>• {productos.find(p=>p.id===id)?.nombre || id}: {String(c)} und</p>)}</div><div className="card p-4"><h2 className="font-semibold mb-2">Clientes con mayor valor comprado</h2>{topClientes.map(([id,v])=><p key={String(id)}>• {clientes.find(c=>c.id===id)?.nombre || id}: ${Number(v).toLocaleString('es-CO')}</p>)}</div></div><div className="card p-4"><p>Clientes sin compra reciente: <b>{sinReciente.length}</b></p><p>Clientes en recaptura: <b>{recaptura.length}</b></p><p>Oportunidades de recompra: <b>{sinReciente.length}</b></p></div></div></LayoutShell>
}
