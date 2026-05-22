'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Tarea } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TareasPage(){
  const [tareas,setTareas]=useState<Tarea[]>([]); const [clientes,setClientes]=useState<Cliente[]>([]);
  useEffect(()=>{(async()=>{const [t,c]=await Promise.all([supabase.from('tareas').select('*').order('fecha_vencimiento',{ascending:true}),supabase.from('clientes').select('*')]); setTareas((t.data??[]) as Tarea[]); setClientes((c.data??[]) as Cliente[]);})();},[]);
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Tareas comerciales</h1><p className="text-slate-600">Gestiona pendientes para cerrar oportunidades y mejorar recompra.</p><div className="card p-5">{tareas.length===0?<p className="text-slate-500">No hay tareas registradas por ahora.</p>:tareas.map(t=>{const c=clientes.find(x=>x.id===t.cliente_id);return <div key={t.id} className="border border-blue-100 rounded-2xl p-3 mb-2 bg-white/80"><p className="font-semibold">{t.tipo} · {c?.nombre || 'Cliente'}</p><p className="text-sm text-slate-600">Vence: {t.fecha_vencimiento} · Estado: <span className="badge">{t.estado}</span></p><p className="text-sm text-slate-500">{t.notas}</p></div>})}</div></div></LayoutShell>
}
