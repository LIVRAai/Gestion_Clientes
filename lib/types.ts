export type Etapa = 'Atracción' | 'Profundización' | 'Fidelización' | 'Retención' | 'Recaptura';
export type Estado = 'Nuevo' | 'Contactado' | 'Interesado' | 'Cliente activo' | 'En riesgo' | 'Inactivo' | 'Recuperado';

export interface Cliente {
  id: string;
  user_id: string;
  nombre: string;
  celular: string;
  email: string;
  empresa: string;
  etapa_ciclo_vida: Etapa;
  estado: Estado;
  origen: string;
  ultima_compra: string | null;
  valor_ultima_compra: number;
  valor_estimado_recompra: number;
  fecha_ultimo_contacto: string | null;
  notas: string;
  created_at: string;
  updated_at: string;
}

export interface Tarea {
  id: string;
  user_id: string;
  cliente_id: string;
  tipo: 'llamada' | 'WhatsApp' | 'email' | 'reunión';
  estado: 'pendiente' | 'completada';
  fecha_vencimiento: string;
  notas: string;
}
