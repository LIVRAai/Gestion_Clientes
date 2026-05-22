'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Producto } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

export default function ComprasPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [productos,setProductos]=useState<Producto[]>([]); const [compras,setCompras]=useState<Compra[]>([]); const [msg,setMsg]=useState('');
  const [form,setForm]=useState<any>({cliente_id:'',producto_id:'',fecha_compra:new Date().toISOString().slice(0,10),cantidad:1,valor_unitario:0,notas:''});
  const valorTotal = useMemo(()=>Number(form.cantidad||0)*Number(form.valor_unitario||0),[form]);
  const load=async()=>{
    const [c,p,co]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('productos').select('*'),supabase.from('compras').select('*').order('fecha_compra',{ascending:false})]);
    if(c.error||p.error||co.error){setMsg(c.error?.message||p.error?.message||co.error?.message||'Error'); return;}
    setClientes((c.data??[]) as Cliente[]); setProductos((p.data??[]) as Producto[]); setCompras((co.data??[]) as Compra[]);
  };
  useEffect(()=>{load()},[]);
  async function save(e:React.FormEvent){e.preventDefault(); const user=(await supabase.auth.getUser()).data.user; if(!user) return setMsg('Sesión no válida'); const {error}=await supabase.from('compras').insert({...form,valor_total:valorTotal,user_id:user.id}); if(error) return setMsg(error.message); setMsg('Compra registrada.'); setForm({...form,cantidad:1,valor_unitario:0,notas:''}); load();}
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Operación de compras</h1><form onSubmit={save} className="card p-4 grid md:grid-cols-3 gap-3"><select className="input" value={form.cliente_id} onChange={e=>setForm({...form,cliente_id:e.target.value})} required><option value="">Cliente</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select><select className="input" value={form.producto_id} onChange={e=>{const prod=productos.find(p=>p.id===e.target.value);setForm({...form,producto_id:e.target.value,valor_unitario:Number(prod?.precio||0)})}} required><option value="">Producto</option>{productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select><input className="input" type="date" value={form.fecha_compra} onChange={e=>setForm({...form,fecha_compra:e.target.value})} required/><input className="input" type="number" min={1} value={form.cantidad} onChange={e=>setForm({...form,cantidad:Number(e.target.value)})} required/><input className="input" type="number" min={0} value={form.valor_unitario} onChange={e=>setForm({...form,valor_unitario:Number(e.target.value)})} required/><input className="input" value={valorTotal} readOnly/><input className="border rounded p-2 md:col-span-2" placeholder="Notas" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})}/><button className="btn-primary">Registrar compra</button></form>{msg && <p className="text-sm text-slate-600">{msg}</p>}<div className="card overflow-hidden"><table className="w-full text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-left">Cliente</th><th>Producto</th><th>Fecha</th><th>Cantidad</th><th>Total</th></tr></thead><tbody>{compras.map(c=>{const cli=clientes.find(x=>x.id===c.cliente_id);const pro=productos.find(x=>x.id===c.producto_id);return <tr key={c.id} className="border-t"><td className="p-3">{cli?.nombre}</td><td>{pro?.nombre}</td><td>{c.fecha_compra}</td><td>{c.cantidad}</td><td>${Number(c.valor_total).toLocaleString('es-CO')}</td></tr>})}</tbody></table></div></div></LayoutShell>
}
