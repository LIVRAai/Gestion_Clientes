import LayoutShell from '@/components/LayoutShell';
import { clientesDemo, tareasDemo } from '@/lib/mock';
import { linkWhatsapp, sugerenciaWhatsapp } from '@/lib/utils';

export default function ClienteDetalle({ params }: { params: { id: string } }) {
  const cliente = clientesDemo.find(c=>c.id===params.id) ?? clientesDemo[0];
  const tareas = tareasDemo.filter(t=>t.cliente_id===cliente.id);
  const msg = sugerenciaWhatsapp(cliente.etapa_ciclo_vida, cliente.nombre);
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">{cliente.nombre}</h1><div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><p><b>Etapa:</b> {cliente.etapa_ciclo_vida}</p><p><b>Última compra:</b> {cliente.ultima_compra}</p><p><b>Notas:</b> {cliente.notas}</p><a className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded" href={linkWhatsapp(cliente.celular,msg)} target="_blank">Enviar WhatsApp</a></div><div className="card p-5"><h2 className="font-semibold">Tareas</h2>{tareas.map(t=><p key={t.id}>• {t.tipo} - {t.estado} ({t.fecha_vencimiento})</p>)}</div></div></div></LayoutShell>;
}
