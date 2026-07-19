// Serializa el comparativo en el query string (?c=...) para compartirlo sin backend.
// Formato compacto: array de tuplas [name, container, ml, units, price, priceMode, abv, store, [lat, lng]]

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function shareUrl(entries) {
  const compact = entries.map((e) => [
    e.name,
    e.container,
    e.mlPerUnit,
    e.units,
    e.price,
    e.priceMode,
    e.abv ?? null,
    e.store ?? '',
    e.location ? [e.location.lat, e.location.lng] : null,
  ]);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('c', toBase64Url(JSON.stringify(compact)));
  return url.toString();
}

export function entriesFromUrl() {
  const param = new URLSearchParams(window.location.search).get('c');
  if (!param) return null;
  try {
    const compact = JSON.parse(fromBase64Url(param));
    if (!Array.isArray(compact)) return null;
    return compact.map(([name, container, mlPerUnit, units, price, priceMode, abv, store, loc]) => ({
      id: crypto.randomUUID(),
      name: String(name || 'Sin nombre'),
      container: String(container || 'otro'),
      mlPerUnit: Number(mlPerUnit) || 1,
      units: Number(units) || 1,
      price: Number(price) || 0,
      priceMode: priceMode === 'unit' ? 'unit' : 'total',
      abv: Number(abv) > 0 ? Number(abv) : null,
      store: String(store || ''),
      location:
        Array.isArray(loc) && Number.isFinite(loc[0]) && Number.isFinite(loc[1])
          ? { lat: loc[0], lng: loc[1] }
          : null,
    }));
  } catch {
    return null;
  }
}
