'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Etapa } from '@/lib/types';
import { MENSAJES_DEFAULT, renderMensaje } from '@/lib/messages';
import { useEffect, useState } from 'react';

type Msg = { id?: string; etapa: Etapa; mensaje: string };
const etapas: Etapa[] = ['Atracción','Profundización','Fidelización','Retención','Recaptura'];

export default function MensajesPage(){
  const [items,setItems]=useState<Record<string, Msg>>({}); const [msg,setMsg]=useState('');
  const ejemplo = { nombre:'Ana', empresa:'Ana Store', etapa:'Recaptura', ultima_compra:'2026-05-10', valor_total:120000, dias_sin_compra:45 };

  async function load(){
    const {data,error}=await supabase.from('mensajes_etapa').select('*');
    if(error) return setMsg(error.message);
    const mapped: Record<string, Msg> = {};
    etapas.forEach((e)=> mapped[e]={etapa:e,mensaje:MENSAJES_DEFAULT[e]});
    (data??[]).forEach((r:any)=> mapped[r.etapa]={id:r.id,etapa:r.etapa,mensaje:r.mensaje});
    setItems(mapped);
  }
  useEffect(()=>{load()},[]);

  async function save(etapa: Etapa){
    const user=(await supabase.auth.getUser()).data.user; if(!user) return setMsg('Sesión no válida');
    const curr=items[etapa];
    const payload = { user_id:user.id, etapa, mensaje:curr.mensaje };
    const {error}= curr.id
      ? await supabase.from('mensajes_etapa').update(payload).eq('id',curr.id)
      : await supabase.from('mensajes_etapa').insert(payload);
    if(error) return setMsg(error.message);
    setMsg(`Mensaje guardado para ${etapa}.`); load();
  }

  return <LayoutShell><div className="space-y-4 max-w-[1200px]"><h1 className="text-3xl font-bold">Mensajes por etapa</h1><p className="text-slate-600">Configura los textos de WhatsApp para cada etapa del ciclo de vida.</p>{msg && <p className="text-sm text-slate-600">{msg}</p>}<div className="grid md:grid-cols-2 gap-4">{etapas.map((e)=><div key={e} className="card p-4 space-y-3"><h2 className="text-xl font-semibold">{e}</h2><p className="text-xs text-slate-500">Variables: {'{nombre}'} {'{empresa}'} {'{etapa}'} {'{ultima_compra}'} {'{valor_total}'} {'{dias_sin_compra}'}</p><textarea className="input min-h-36" value={items[e]?.mensaje||MENSAJES_DEFAULT[e]} onChange={ev=>setItems((p)=>({...p,[e]:{...p[e],etapa:e,mensaje:ev.target.value}}))}/><div className="rounded-xl bg-blue-50 p-3 border border-blue-100"><p className="text-xs text-slate-500 mb-1">Vista previa</p><p className="text-sm">{renderMensaje(items[e]?.mensaje||MENSAJES_DEFAULT[e], {...ejemplo, etapa:e})}</p></div><button className="btn-primary" onClick={()=>save(e)}>Guardar</button></div>)}</div></div></LayoutShell>
}
