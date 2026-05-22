import LayoutShell from '@/components/LayoutShell';
import { clientesDemo } from '@/lib/mock';
import { etapas } from '@/lib/utils';

export default function Dashboard() {
  return <LayoutShell><div className="space-y-6"><h1 className="text-3xl font-bold">Dashboard comercial</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[
    ['Total clientes', clientesDemo.length],
    ['Clientes en recaptura', clientesDemo.filter(c=>c.etapa_ciclo_vida==='Recaptura').length],
    ['Sin contacto reciente', clientesDemo.filter(c=>c.fecha_ultimo_contacto!<'2026-04-01').length]
  ].map(([t,v])=><div key={String(t)} className="card p-5"><p className="text-sm text-slate-500">{t}</p><p className="text-3xl font-bold">{v}</p></div>)}</div><div className="card p-6"><h2 className="font-semibold mb-3">Clientes por etapa</h2><div className="grid md:grid-cols-5 gap-3">{etapas.map(e=><div key={e} className="bg-blue-50 rounded-xl p-3"><p>{e}</p><p className="font-bold">{clientesDemo.filter(c=>c.etapa_ciclo_vida===e).length}</p></div>)}</div></div></div></LayoutShell>;
}
