export const CONTAINERS = [
  { id: 'lata', label: 'Lata', emoji: '🥫' },
  { id: 'botella', label: 'Botella', emoji: '🍾' },
  { id: 'caguama', label: 'Caguama', emoji: '🍺' },
  { id: 'lata-alta', label: 'Latón', emoji: '🧃' },
  { id: 'growler', label: 'Growler', emoji: '🛢️' },
  { id: 'barril', label: 'Barril', emoji: '🛢️' },
  { id: 'otro', label: 'Otro', emoji: '🍻' },
];

export const ML_PRESETS = [269, 330, 355, 473, 500, 650, 710, 940, 1200];

export function containerLabel(id) {
  const c = CONTAINERS.find((c) => c.id === id);
  return c ? `${c.emoji} ${c.label}` : id;
}

export function computeEntry({ mlPerUnit, units, price, priceMode }) {
  const totalMl = mlPerUnit * units;
  const totalPrice = priceMode === 'unit' ? price * units : price;
  return {
    totalMl,
    totalPrice,
    perMl: totalPrice / totalMl,
    perLiter: (totalPrice / totalMl) * 1000,
  };
}

const mxn = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const mxnPrecise = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function fmtMoney(n) {
  return mxn.format(n);
}

export function fmtPerMl(n) {
  return mxnPrecise.format(n);
}

export function fmtMl(n) {
  return n >= 1000 ? `${(n / 1000).toLocaleString('es-MX')} L` : `${n.toLocaleString('es-MX')} ml`;
}
