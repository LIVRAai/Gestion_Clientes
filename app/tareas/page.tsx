import LayoutShell from '@/components/LayoutShell';
import { tareasDemo, clientesDemo } from '@/lib/mock';

export default function TareasPage(){
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Tareas de seguimiento</h1><div className="card p-5"><p className="text-slate-600 mb-2">MVP: alta y edición conectando formulario a Supabase.</p>{tareasDemo.map(t=>{const c=clientesDemo.find(x=>x.id===t.cliente_id);return <div key={t.id} className="border rounded-xl p-3 mb-2"><p className="font-semibold">{t.tipo} · {c?.nombre}</p><p>Vence: {t.fecha_vencimiento}</p><p>Estado: {t.estado}</p></div>})}</div></div></LayoutShell>
}
