import LayoutShell from '@/components/LayoutShell';
import { clientesDemo } from '@/lib/mock';
import { diasDesde, linkWhatsapp, scoreRecompra, sugerenciaWhatsapp } from '@/lib/utils';

export default function RecompraPage(){
  return <LayoutShell><div className="space-y-4"><h1 className="text-3xl font-bold">Motor de Recompra</h1><div className="space-y-3">{clientesDemo.map(c=>{const nivel=scoreRecompra(c);const msg=sugerenciaWhatsapp(c.etapa_ciclo_vida,c.nombre);return <div key={c.id} className="card p-4 flex justify-between items-center"><div><p className="font-semibold">{c.nombre} <span className="text-xs bg-blue-100 px-2 py-1 rounded">{nivel}</span></p><p className="text-sm">Días desde última compra: {diasDesde(c.ultima_compra)}</p><p className="text-sm">Valor potencial: ${c.valor_estimado_recompra.toLocaleString('es-CO')}</p></div><a href={linkWhatsapp(c.celular,msg)} className="bg-accent text-white px-4 py-2 rounded-xl">WhatsApp</a></div>})}</div></div></LayoutShell>
}
