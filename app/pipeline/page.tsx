import LayoutShell from '@/components/LayoutShell';
import { clientesDemo } from '@/lib/mock';
import { etapas } from '@/lib/utils';

export default function PipelinePage() {
  return <LayoutShell><div><h1 className="text-3xl font-bold mb-4">Pipeline de ciclo de vida</h1><div className="grid md:grid-cols-5 gap-3">{etapas.map(et=> <div key={et} className="card p-3"><p className="font-semibold">{et}</p><div className="space-y-2 mt-3">{clientesDemo.filter(c=>c.etapa_ciclo_vida===et).map(c=><div key={c.id} className="bg-blue-50 p-3 rounded-xl"><p className="font-medium">{c.nombre}</p><p className="text-xs">{c.empresa}</p></div>)}</div></div>)}</div></div></LayoutShell>;
}
