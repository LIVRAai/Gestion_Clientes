'use client';
import LayoutShell from '@/components/LayoutShell';
import { supabase } from '@/lib/supabase';
import { Cliente, Compra, Tarea } from '@/lib/types';
import { linkWhatsapp, sugerenciaWhatsapp, ultimaCompraPorCliente } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ClienteDetalle({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    (async () => {
      const [c, t, co] = await Promise.all([
        supabase.from('clientes').select('*').eq('id', params.id).single(),
        supabase.from('tareas').select('*').eq('cliente_id', params.id),
        supabase.from('compras').select('*').eq('cliente_id', params.id).order('fecha_compra', { ascending: false })
      ]);
      if (c.data) setCliente(c.data as Cliente);
      setTareas((t.data ?? []) as Tarea[]);
      setCompras((co.data ?? []) as Compra[]);
    })();
  }, [params.id]);

  if (!cliente) return <LayoutShell><p>Cargando cliente...</p></LayoutShell>;

  const ultimaCompra = ultimaCompraPorCliente(compras, cliente.id);
  const msg = sugerenciaWhatsapp(cliente.etapa_ciclo_vida, cliente.nombre);

  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">{cliente.nombre}</h1><div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><p><b>Etapa:</b> {cliente.etapa_ciclo_vida}</p><p><b>Última compra:</b> {ultimaCompra ?? 'Sin compras'}</p><p><b>Notas:</b> {cliente.notas}</p><a className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded" href={linkWhatsapp(cliente.celular,msg)} target="_blank">Enviar WhatsApp</a></div><div className="card p-5"><h2 className="font-semibold">Tareas</h2>{tareas.map(t=><p key={t.id}>• {t.tipo} - {t.estado} ({t.fecha_vencimiento})</p>)}<h2 className="font-semibold mt-4">Compras</h2>{compras.slice(0,5).map(c=><p key={c.id}>• {c.fecha_compra} - ${Number(c.valor_total).toLocaleString('es-CO')}</p>)}</div></div></div></LayoutShell>;
}
