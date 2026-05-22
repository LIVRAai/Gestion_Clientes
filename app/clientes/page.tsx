'use client';

import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente } from '@/lib/types';
import { etapas } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const emptyForm = { nombre: '', celular: '', email: '', empresa: '', etapa_ciclo_vida: 'Atracción', estado: 'Nuevo', origen: '', notas: '' };

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [q, setQ] = useState('');
  const [etapa, setEtapa] = useState('');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
    if (error) return setMsg(error.message);
    setClientes((data ?? []) as Cliente[]);
  }
  useEffect(() => { load(); }, []);

  async function saveCliente(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return setMsg('Sesión no válida. Inicia sesión nuevamente.');
    if (editingId) {
      const { error } = await supabase.from('clientes').update(form).eq('id', editingId);
      if (error) return setMsg(error.message); setMsg('Cliente actualizado.');
    } else {
      const { error } = await supabase.from('clientes').insert({ ...form, user_id: user.id });
      if (error) return setMsg(error.message); setMsg('Cliente creado.');
    }
    setForm(emptyForm); setEditingId(null); load();
  }

  async function removeCliente(id: string) {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) return setMsg(error.message);
    setMsg('Cliente eliminado.');
    load();
  }

  const list = useMemo(() => clientes.filter((c) => (!q || c.nombre.toLowerCase().includes(q.toLowerCase())) && (!etapa || c.etapa_ciclo_vida === etapa)), [clientes, q, etapa]);

  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Base de clientes</h1>
    <form onSubmit={saveCliente} className="card p-4 grid md:grid-cols-3 gap-3">
      <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} required />
      <input className="input" placeholder="Celular" value={form.celular} onChange={(e)=>setForm({...form,celular:e.target.value})} required />
      <input className="input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input className="input" placeholder="Empresa" value={form.empresa} onChange={(e)=>setForm({...form,empresa:e.target.value})} />
      <select className="input" value={form.etapa_ciclo_vida} onChange={(e)=>setForm({...form,etapa_ciclo_vida:e.target.value})}>{etapas.map(x=><option key={x}>{x}</option>)}</select>
      <input className="input" placeholder="Estado" value={form.estado} onChange={(e)=>setForm({...form,estado:e.target.value})} />
      <input className="input" placeholder="Origen" value={form.origen} onChange={(e)=>setForm({...form,origen:e.target.value})} />
      <input className="input md:col-span-2" placeholder="Notas" value={form.notas} onChange={(e)=>setForm({...form,notas:e.target.value})} />
      <button className="btn-primary">{editingId ? 'Guardar cambios' : 'Crear cliente'}</button>
    </form>
    <div className="flex gap-3"><input className="input" placeholder="Buscar cliente" value={q} onChange={e=>setQ(e.target.value)} /><select className="input" value={etapa} onChange={e=>setEtapa(e.target.value)}><option value="">Todas las etapas</option>{etapas.map(x=><option key={x}>{x}</option>)}</select></div>
    {msg && <p className="text-sm text-slate-700">{msg}</p>}
    <div className="card overflow-hidden"><table className="w-full text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-left">Nombre</th><th className="text-left">Etapa</th><th className="text-left">Estado</th><th className="text-left">Origen</th><th className="text-left">Acciones</th></tr></thead><tbody>{list.map(c=><tr key={c.id} className="border-t"><td className="p-3">{c.nombre}<p className="text-slate-500">{c.empresa}</p></td><td>{c.etapa_ciclo_vida}</td><td><span className="px-2 py-1 rounded bg-blue-100">{c.estado}</span></td><td>{c.origen?.trim() ? c.origen : <span className="text-slate-400">Sin origen</span>}</td><td><div className="flex flex-wrap gap-2 py-2"><Link href={`/clientes/${c.id}`} className="btn-secondary !px-3 !py-1.5 text-xs">Ver</Link><button onClick={()=>{setEditingId(c.id);setForm(c);}} className="btn-secondary !px-3 !py-1.5 text-xs">Editar</button><a target="_blank" href={`https://wa.me/57${c.celular}`} className="btn-secondary !px-3 !py-1.5 text-xs !text-green-700">WhatsApp</a><button onClick={()=>removeCliente(c.id)} className="btn-secondary !px-3 !py-1.5 text-xs !text-red-600">Eliminar</button></div></td></tr>)}</tbody></table>{list.length===0 && <div className="p-8 text-center text-slate-500">Aún no tienes clientes. Crea el primero para empezar a gestionar relaciones.</div>}</div></div></LayoutShell>;
}
