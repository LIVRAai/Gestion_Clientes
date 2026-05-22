'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Tarea } from '@/lib/types';
import { linkWhatsapp, sugerenciaWhatsapp, ultimaCompraPorCliente } from '@/lib/utils';
import { calcularLifecycle } from '@/lib/lifecycle';
import { cop } from '@/lib/format';
import { MENSAJES_DEFAULT, renderMensaje } from '@/lib/messages';
import { useEffect, useState } from 'react';

export default function ClienteDetalle({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [mensajes, setMensajes] = useState<Record<string,string>>({});

  useEffect(() => {
    (async () => {
      const [c, t, co, m] = await Promise.all([
        supabase.from('clientes').select('*').eq('id', params.id).single(),
        supabase.from('tareas').select('*').eq('cliente_id', params.id),
        supabase.from('compras').select('*').eq('cliente_id', params.id).order('fecha_compra', { ascending: false }),
        supabase.from('mensajes_etapa').select('*')
      ]);
      if (c.data) setCliente(c.data as Cliente);
      setTareas((t.data ?? []) as Tarea[]);
      setCompras((co.data ?? []) as Compra[]);
      const mm:any={}; (m.data??[]).forEach((x:any)=>mm[x.etapa]=x.mensaje); setMensajes(mm);
    })();
  }, [params.id]);

  if (!cliente) return <LayoutShell><p>Cargando cliente...</p></LayoutShell>;

  const ultimaCompra = ultimaCompraPorCliente(compras, cliente.id);
  const auto = calcularLifecycle(cliente, compras);
  const template = mensajes[auto.etapa_ciclo_vida] || MENSAJES_DEFAULT[auto.etapa_ciclo_vida];
  const msg = renderMensaje(template,{nombre:cliente.nombre,empresa:cliente.empresa,etapa:auto.etapa_ciclo_vida,ultima_compra:ultimaCompra,valor_total:auto.valor_total_cliente,dias_sin_compra:auto.dias_desde_ultima_compra});

  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">{cliente.nombre}</h1><div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><p><b>Etapa automática:</b> {auto.etapa_ciclo_vida}</p><p><b>Estado automático:</b> {auto.estado}</p><p><b>Última compra:</b> {ultimaCompra ?? 'Sin compras'}</p><p><b>Número de compras:</b> {auto.numero_compras}</p><p><b>Valor total comprado:</b> {cop(auto.valor_total_cliente)}</p><p><b>Días desde última compra:</b> {auto.dias_desde_ultima_compra}</p><p><b>Próxima acción:</b> {auto.proxima_accion_sugerida}</p><p><b>Notas:</b> {cliente.notas}</p><a className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded" href={linkWhatsapp(cliente.celular,msg)} target="_blank">Enviar WhatsApp</a></div><div className="card p-5"><h2 className="font-semibold">Tareas</h2>{tareas.map(t=><p key={t.id}>• {t.tipo} - {t.estado} ({t.fecha_vencimiento})</p>)}<h2 className="font-semibold mt-4">Compras</h2>{compras.slice(0,5).map(c=><p key={c.id}>• {c.fecha_compra} - ${Number(c.valor_total).toLocaleString('es-CO')}</p>)}</div></div></div></LayoutShell>;
}
