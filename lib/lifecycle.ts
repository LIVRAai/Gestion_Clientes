import { Cliente, Compra } from './types';
import { diasDesde } from './utils';

export type EstadoAuto = 'Nuevo' | 'Activo' | 'Seguimiento' | 'En riesgo' | 'Inactivo' | 'Cliente activo';

export interface LifecycleResult {
  etapa_ciclo_vida: Cliente['etapa_ciclo_vida'];
  estado: EstadoAuto;
  proxima_accion_sugerida: string;
  dias_desde_ultima_compra: number;
  valor_total_cliente: number;
  numero_compras: number;
  ultima_compra: string | null;
}

export function calcularLifecycle(cliente: Cliente, compras: Compra[]): LifecycleResult {
  const delCliente = compras.filter((c) => c.cliente_id === cliente.id);
  const numero = delCliente.length;
  const valorTotal = delCliente.reduce((a, c) => a + Number(c.valor_total || 0), 0);
  const ultima = delCliente.map((c) => c.fecha_compra).sort().reverse()[0] ?? null;
  const dias = diasDesde(ultima);

  if (numero === 0) {
    return { etapa_ciclo_vida: 'Atracción', estado: 'Nuevo', proxima_accion_sugerida: 'Realizar primer contacto', dias_desde_ultima_compra: 999, valor_total_cliente: 0, numero_compras: 0, ultima_compra: null };
  }

  if (dias > 90) {
    return { etapa_ciclo_vida: 'Recaptura', estado: 'Inactivo', proxima_accion_sugerida: 'Enviar campaña de reactivación', dias_desde_ultima_compra: dias, valor_total_cliente: valorTotal, numero_compras: numero, ultima_compra: ultima };
  }

  if (dias >= 61) {
    return { etapa_ciclo_vida: 'Retención', estado: 'En riesgo', proxima_accion_sugerida: 'Hacer seguimiento preventivo', dias_desde_ultima_compra: dias, valor_total_cliente: valorTotal, numero_compras: numero, ultima_compra: ultima };
  }

  if (numero >= 2 && dias <= 60) {
    return { etapa_ciclo_vida: 'Fidelización', estado: 'Cliente activo', proxima_accion_sugerida: 'Enviar beneficio o agradecimiento', dias_desde_ultima_compra: dias, valor_total_cliente: valorTotal, numero_compras: numero, ultima_compra: ultima };
  }

  const estado: EstadoAuto = dias <= 30 ? 'Activo' : 'Seguimiento';
  return { etapa_ciclo_vida: 'Profundización', estado, proxima_accion_sugerida: 'Recomendar producto complementario', dias_desde_ultima_compra: dias, valor_total_cliente: valorTotal, numero_compras: numero, ultima_compra: ultima };
}
