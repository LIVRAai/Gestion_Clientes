'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Producto } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

export default function ComprasPage(){
  const [clientes,setClientes]=useState<Cliente[]>([]); const [productos,setProductos]=useState<Producto[]>([]); const [compras,setCompras]=useState<Compra[]>([]); const [msg,setMsg]=useState('');
  const [form,setForm]=useState<any>({cliente_id:'',producto_id:'',fecha_compra:'',cantidad:'',valor_unitario:'',notas:''});
  const valorTotal = useMemo(()=>Number(form.cantidad||0)*Number(form.valor_unitario||0),[form]);

  const load=async()=>{
    const [c,p,co]=await Promise.all([supabase.from('clientes').select('*'),supabase.from('productos').select('*'),supabase.from('compras').select('*').order('fecha_compra',{ascending:false})]);
    if(c.error||p.error||co.error){setMsg(c.error?.message||p.error?.message||co.error?.message||'Error'); return;}
    setClientes((c.data??[]) as Cliente[]); setProductos((p.data??[]) as Producto[]); setCompras((co.data??[]) as Compra[]);
  };
  useEffect(()=>{load()},[]);

  async function save(e:React.FormEvent){
    e.preventDefault();
    const user=(await supabase.auth.getUser()).data.user;
    if(!user) return setMsg('Sesión no válida');
    const {error}=await supabase.from('compras').insert({...form,valor_total:valorTotal,user_id:user.id});
    if(error) return setMsg(error.message);
    setMsg('Compra registrada.');
    setForm({cliente_id:'',producto_id:'',fecha_compra:'',cantidad:'',valor_unitario:'',notas:''});
    load();
  }

  return <LayoutShell><div className="space-y-5"><h1 className="text-3xl font-bold">Operación de compras</h1><p className="text-slate-600">Registra compras para entender comportamiento, recompra y valor por cliente.</p>
    <form onSubmit={save} className="card p-5 space-y-5">
      <div>
        <p className="text-sm font-semibold mb-3">Datos principales</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="label">Cliente</label><select className="input" value={form.cliente_id} onChange={e=>setForm({...form,cliente_id:e.target.value})} required><option value="" disabled>Selecciona un cliente</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select><p className="help">Selecciona el cliente que realizó la compra.</p></div>
          <div><label className="label">Producto o servicio</label><select className="input" value={form.producto_id} onChange={e=>{const prod=productos.find(p=>p.id===e.target.value);setForm({...form,producto_id:e.target.value,valor_unitario:Number(prod?.precio||0)})}} required><option value="" disabled>Selecciona un producto</option>{productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select><p className="help">El valor unitario se autocompleta desde el catálogo.</p></div>
          <div><label className="label">Fecha de compra</label><input className="input" type="date" value={form.fecha_compra} onChange={e=>setForm({...form,fecha_compra:e.target.value})} required/><p className="help">Usa la fecha real en que el cliente compró.</p></div>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Detalle económico</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="label">Cantidad</label><input className="input" type="number" min={1} placeholder="Ej. 1" value={form.cantidad} onChange={e=>setForm({...form,cantidad:Number(e.target.value)})} required/></div>
          <div><label className="label">Valor unitario</label><input className="input" type="number" min={0} placeholder="Ej. 100000" value={form.valor_unitario} onChange={e=>setForm({...form,valor_unitario:Number(e.target.value)})} required/></div>
          <div><label className="label">Valor total</label><input className="input bg-slate-50" value={valorTotal || ''} placeholder="Se calcula automáticamente" readOnly/></div>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Notas</p>
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2"><label className="label">Notas de la compra</label><input className="input" placeholder="Ej. Cliente compró después de campaña de WhatsApp." value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})}/><p className="help">Agrega contexto para futuras acciones de recompra.</p></div>
          <button className="btn-primary md:w-auto w-full h-11">Registrar compra</button>
        </div>
      </div>
    </form>
    {msg && <p className="text-sm text-slate-600">{msg}</p>}
    <div className="card overflow-hidden"><table className="w-full text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-left">Cliente</th><th className="text-left">Producto</th><th className="text-left">Fecha</th><th className="text-center">Cantidad</th><th className="text-right pr-4">Total</th></tr></thead><tbody>{compras.map(c=>{const cli=clientes.find(x=>x.id===c.cliente_id);const pro=productos.find(x=>x.id===c.producto_id);return <tr key={c.id} className="border-t"><td className="p-3 text-left">{cli?.nombre}</td><td className="text-left">{pro?.nombre}</td><td className="text-left">{c.fecha_compra}</td><td className="text-center">{c.cantidad}</td><td className="text-right pr-4 font-medium">${Number(c.valor_total).toLocaleString('es-CO')}</td></tr>})}</tbody></table></div></div></LayoutShell>
}
