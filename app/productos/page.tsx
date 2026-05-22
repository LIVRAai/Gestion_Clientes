'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/lib/types';
import { cop } from '@/lib/format';
import { useEffect, useMemo, useState } from 'react';

const empty = { nombre:'', categoria:'', precio:'', estado:'Activo', descripcion:'' };

export default function ProductosPage(){
  const [items,setItems]=useState<Producto[]>([]); const [q,setQ]=useState(''); const [msg,setMsg]=useState(''); const [form,setForm]=useState<any>(empty); const [editId,setEditId]=useState<string | null>(null);
  const load=async()=>{const {data,error}=await supabase.from('productos').select('*').order('created_at',{ascending:false}); if(error) return setMsg(error.message); setItems((data??[]) as Producto[])};
  useEffect(()=>{load()},[]);

  const save=async(e:React.FormEvent)=>{
    e.preventDefault(); const user=(await supabase.auth.getUser()).data.user; if(!user) return setMsg('Sesión no válida.');
    const payload = { ...form, precio: Number(form.precio || 0) };
    if(editId){const {error}=await supabase.from('productos').update(payload).eq('id',editId); if(error)return setMsg(error.message);} else {const {error}=await supabase.from('productos').insert({...payload,user_id:user.id}); if(error)return setMsg(error.message);} setForm(empty); setEditId(null); setMsg(editId?'Producto actualizado.':'Producto creado.'); load();
  };

  const remove=async(id:string)=>{const {error}=await supabase.from('productos').delete().eq('id',id); if(error)return setMsg(error.message); setMsg('Producto eliminado.'); load();};
  const list = useMemo(()=>items.filter(i=>`${i.nombre} ${i.categoria || ''}`.toLowerCase().includes(q.toLowerCase())),[items,q]);

  return <LayoutShell><div className="space-y-5 max-w-[1200px]"><h1 className="text-3xl font-bold">Catálogo de productos</h1>
    <form onSubmit={save} className="card p-5 grid md:grid-cols-3 gap-4 items-end">
      <div><label className="label">Nombre del producto</label><input className="input" placeholder="Ej. Plan Premium mensual" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required /></div>
      <div><label className="label">Categoría</label><input className="input" placeholder="Ej. Suscripción" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} /></div>
      <div><label className="label">Precio unitario (COP)</label><input className="input" type="number" min={0} placeholder="Ej. 100000" value={form.precio} onChange={e=>setForm({...form,precio:e.target.value})} required /></div>
      <div><label className="label">Estado</label><select className="input" value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}><option>Activo</option><option>Inactivo</option></select></div>
      <div className="md:col-span-2"><label className="label">Descripción</label><input className="input" placeholder="Ej. Incluye soporte y reportes." value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} /></div>
      <button className="btn-primary h-11 w-full md:w-auto md:justify-self-start">{editId?'Guardar cambios':'Crear producto'}</button>
    </form>

    <div className="card p-4"><label className="label">Buscar producto</label><input className="input" placeholder="Escribe nombre o categoría" value={q} onChange={e=>setQ(e.target.value)} /></div>
    {msg && <p className="text-sm text-slate-600">{msg}</p>}

    {list.length===0 ? (
      <div className="card p-10 text-center text-slate-500">Aún no tienes productos. Crea el primero para construir tu catálogo comercial.</div>
    ) : (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((p) => (
          <article key={p.id} className="card card-hover p-5 flex flex-col gap-4 border-blue-100">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-tight">{p.nombre}</h3>
                <span className="badge">{p.estado}</span>
              </div>
              <p className="text-sm text-slate-500">{p.categoria || 'Sin categoría'}</p>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3">
              <p className="text-xs text-slate-500">Precio unitario</p>
              <p className="text-xl font-bold text-navy">{cop(Number(p.precio||0))}</p>
            </div>

            {p.descripcion?.trim() ? (
              <p className="text-sm text-slate-600">{p.descripcion}</p>
            ) : (
              <p className="text-sm text-slate-400">Sin descripción</p>
            )}

            <div className="mt-auto flex flex-wrap gap-2">
              <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={()=>setForm({...p, precio:String(p.precio ?? '')})}>Ver</button>
              <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={()=>{setEditId(p.id);setForm({...p, precio:String(p.precio ?? '')})}}>Editar</button>
              <button className="btn-secondary !px-3 !py-1.5 text-xs !text-red-600" onClick={()=>remove(p.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    )}
  </div></LayoutShell>
}
