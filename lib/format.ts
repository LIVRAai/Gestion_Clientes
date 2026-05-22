export const cop = (value: number) => `$ ${Math.round(value).toLocaleString('es-CO')} COP`;

export const fechaCO = (value?: string | null) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-CO');
};

export const telCO = (value?: string | null) => {
  if (!value) return '—';
  const digits = value.replace(/\D/g, '').slice(-10);
  return digits;
};
