import { Etapa } from './types';
import { cop, fechaCO } from './format';

export const MENSAJES_DEFAULT: Record<Etapa, string> = {
  'Atracción': 'Hola {nombre}, te escribimos porque queremos conocerte mejor y contarte cómo podemos ayudarte.',
  'Profundización': 'Hola {nombre}, gracias por tu primera compra. Tenemos recomendaciones que podrían complementar lo que ya adquiriste.',
  'Fidelización': 'Hola {nombre}, gracias por seguir confiando en nosotros. Queremos compartirte un beneficio especial.',
  'Retención': 'Hola {nombre}, hace un tiempo no sabemos de ti. Queremos saber si podemos ayudarte con algo.',
  'Recaptura': 'Hola {nombre}, queremos volver a conectar contigo. Tenemos nuevas opciones que podrían interesarte.'
};

export function renderMensaje(template: string, data: {
  nombre: string; empresa: string; etapa: string; ultima_compra: string | null; valor_total: number; dias_sin_compra: number;
}) {
  return template
    .replaceAll('{nombre}', data.nombre)
    .replaceAll('{empresa}', data.empresa || 'tu empresa')
    .replaceAll('{etapa}', data.etapa)
    .replaceAll('{ultima_compra}', fechaCO(data.ultima_compra))
    .replaceAll('{valor_total}', cop(data.valor_total))
    .replaceAll('{dias_sin_compra}', String(data.dias_sin_compra));
}
