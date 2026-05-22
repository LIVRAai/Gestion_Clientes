import { Cliente, Tarea } from './types';

export const clientesDemo: Cliente[] = [
  { id:'1', user_id:'demo', nombre:'María López', celular:'3001112233', email:'maria@acme.com', empresa:'Acme SAS', etapa_ciclo_vida:'Retención', estado:'Cliente activo', origen:'Instagram', ultima_compra:'2026-03-10', valor_ultima_compra:800000, valor_estimado_recompra:1200000, fecha_ultimo_contacto:'2026-05-01', notas:'Interés en plan anual', created_at:'2026-01-01', updated_at:'2026-05-01' },
  { id:'2', user_id:'demo', nombre:'Carlos Ruiz', celular:'3014445566', email:'carlos@beta.co', empresa:'Beta', etapa_ciclo_vida:'Recaptura', estado:'En riesgo', origen:'Referido', ultima_compra:'2025-12-20', valor_ultima_compra:450000, valor_estimado_recompra:900000, fecha_ultimo_contacto:'2026-02-01', notas:'Sin respuesta reciente', created_at:'2026-01-05', updated_at:'2026-04-10' }
];

export const tareasDemo: Tarea[] = [
  { id:'t1', user_id:'demo', cliente_id:'1', tipo:'WhatsApp', estado:'pendiente', fecha_vencimiento:'2026-05-25', notas:'Enviar oferta de recompra' }
];
