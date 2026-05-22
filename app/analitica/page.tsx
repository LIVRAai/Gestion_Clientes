'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Producto } from '@/lib/types';
import { scoreRecompraPorFecha, ultimaCompraPorCliente } from '@/lib/utils';
import { cop } from '@/lib/format';
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
  const activos = clientes.filter(c=>scoreRecompraPorFecha(ultimaCompraPorCliente(compras,c.id))==='Activo');
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Lectura del negocio</h1><div className="grid md:grid-cols-4 gap-3">{[['Total clientes',clientes.length],['Total ventas',totalVentas],['Valor total vendido',cop(valorTotal)],['Ticket promedio',cop(ticketProm)]].map(([t,v])=><div key={String(t)} className="card card-hover p-4"><p className="text-sm text-slate-500">{t}</p><p className="text-2xl font-bold">{v}</p></div>)}</div><div className="grid md:grid-cols-2 gap-4"><div className="card p-4"><h2 className="font-semibold mb-2">Productos más vendidos</h2>{topProductos.map(([id,c])=><p key={String(id)}>• {productos.find(p=>p.id===id)?.nombre || id}: {String(c)} und</p>)}</div><div className="card p-4"><h2 className="font-semibold mb-2">Cliente con mayor valor</h2>{topClientes.map(([id,v])=><p key={String(id)}>• {clientes.find(c=>c.id===id)?.nombre || id}: {cop(Number(v))}</p>)}</div></div><div className="card p-4"><p>Frecuencia de compra: <b>{totalVentas && clientes.length ? (totalVentas/clientes.length).toFixed(1) : 0}</b> compras/cliente</p><p>Ingresos recuperados: <b>{cop(valorTotal*0.22)}</b></p><p>Clientes en recaptura: <b>{recaptura.length}</b></p><p>Clientes más activos: <b>{activos.length}</b></p></div></div></LayoutShell>
}
