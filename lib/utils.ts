import { Compra, Etapa } from './types';

export const etapas: Etapa[] = ['Atracción', 'Profundización', 'Fidelización', 'Retención', 'Recaptura'];

export function diasDesde(fecha?: string | null): number {
  if (!fecha) return 999;
  const d = new Date(fecha).getTime();
  return Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
}

export function sugerenciaWhatsapp(etapa: Etapa, nombre: string): string {
  const mapa: Record<Etapa, string> = {
    'Atracción': `Hola ${nombre}, soy de NextUp CRM. ¿Te puedo compartir opciones para impulsar tu negocio?`,
    'Profundización': `Hola ${nombre}, tenemos una recomendación personalizada para tu empresa.`,
    'Fidelización': `¡Gracias ${nombre}! Queremos darte un beneficio especial por tu confianza.`,
    'Retención': `Hola ${nombre}, queremos acompañarte para que sigas logrando resultados.`,
    'Recaptura': `Hola ${nombre}, nos encantaría volver a trabajar contigo. ¿Hablamos?`
  };
  return mapa[etapa];
}

export function linkWhatsapp(celular: string, mensaje: string): string {
  return `https://wa.me/57${celular.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
}

export function ultimaCompraPorCliente(compras: Compra[], clienteId: string): string | null {
  const fechas = compras.filter((c) => c.cliente_id === clienteId).map((c) => c.fecha_compra).sort().reverse();
  return fechas[0] ?? null;
}

export function scoreRecompraPorFecha(fecha: string | null): 'Activo' | 'Seguimiento' | 'En riesgo' | 'Recaptura' {
  const dias = diasDesde(fecha);
  if (dias <= 30) return 'Activo';
  if (dias <= 60) return 'Seguimiento';
  if (dias <= 90) return 'En riesgo';
  return 'Recaptura';
}
