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
  notas: string;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: string;
  user_id: string;
  nombre: string;
  categoria: string;
  precio: number;
  estado: 'Activo' | 'Inactivo';
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface Compra {
  id: string;
  user_id: string;
  cliente_id: string;
  producto_id: string;
  fecha_compra: string;
  cantidad: number;
  valor_unitario: number;
  valor_total: number;
  notas: string;
  created_at: string;
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
