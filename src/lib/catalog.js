// Catálogo de marcas comunes en México. Los ABV son aproximados y editables.

export const PRESENTATIONS = {
  ampolleta: { short: 'ampolleta', container: 'botella', ml: 190, units: 6 },
  cuartito: { short: 'cuartito', container: 'botella', ml: 207, units: 6 },
  barrilito: { short: 'barrilito', container: 'botella', ml: 325, units: 6 },
  media: { short: 'media', container: 'botella', ml: 355, units: 6 },
  botella355: { short: 'botella', container: 'botella', ml: 355, units: 6 },
  lata355: { short: 'lata', container: 'lata', ml: 355, units: 6 },
  laton473: { short: 'latón', container: 'lata-alta', ml: 473, units: 1 },
  caguama940: { short: 'caguama', container: 'caguama', ml: 940, units: 1 },
  mega1200: { short: 'mega', container: 'caguama', ml: 1200, units: 1 },
};

function brand(name, abv, keys, aliases = {}) {
  return {
    name,
    abv,
    presentations: keys.map((key) => {
      const base = PRESENTATIONS[key];
      return { key, ...base, short: aliases[key] ?? base.short };
    }),
  };
}

export const BRANDS = [
  // Grupo Modelo
  brand('Corona Extra', 4.5, ['ampolleta', 'cuartito', 'media', 'lata355', 'laton473', 'caguama940', 'mega1200']),
  brand('Corona Light', 4.0, ['media', 'lata355', 'laton473']),
  brand('Corona Familiar', 4.5, ['media', 'caguama940']),
  brand('Victoria', 4.0, ['cuartito', 'media', 'lata355', 'laton473', 'caguama940', 'mega1200']),
  brand('Modelo Especial', 4.5, ['media', 'lata355', 'laton473', 'caguama940', 'mega1200']),
  brand('Negra Modelo', 5.3, ['media', 'lata355', 'laton473']),
  brand('Pacífico', 4.5, ['cuartito', 'media', 'lata355', 'laton473', 'caguama940'], { caguama940: 'ballena' }),
  brand('León', 4.5, ['media', 'caguama940']),
  brand('Montejo', 4.5, ['media', 'lata355']),
  brand('Estrella', 4.5, ['media', 'caguama940']),
  brand('Barrilito', 3.6, ['barrilito']),
  brand('Michelob Ultra', 4.2, ['botella355', 'lata355', 'laton473']),
  // Heineken México (Cuauhtémoc Moctezuma)
  brand('Tecate', 4.5, ['media', 'lata355', 'laton473', 'caguama940']),
  brand('Tecate Light', 3.9, ['lata355', 'laton473', 'caguama940']),
  brand('Indio', 4.1, ['media', 'lata355', 'laton473', 'caguama940']),
  brand('Sol', 4.5, ['media', 'lata355', 'laton473', 'caguama940', 'mega1200']),
  brand('Dos Equis Lager', 4.2, ['media', 'lata355', 'laton473', 'caguama940']),
  brand('Dos Equis Ambar', 4.7, ['media', 'lata355']),
  brand('Superior', 4.5, ['media', 'caguama940']),
  brand('Carta Blanca', 4.5, ['media', 'caguama940', 'mega1200']),
  brand('Bohemia Clara', 4.7, ['botella355', 'laton473']),
  brand('Bohemia Oscura', 5.3, ['botella355']),
  brand('Heineken', 5.0, ['botella355', 'lata355', 'laton473']),
  brand('Heineken 0.0', 0, ['botella355', 'lata355']),
  brand('Amstel Ultra', 3.5, ['botella355', 'lata355', 'laton473']),
];

export function presentationLabel(p) {
  const short = p.short[0].toUpperCase() + p.short.slice(1);
  const vol = p.ml >= 1000 ? `${p.ml / 1000} L` : `${p.ml} ml`;
  return p.units > 1 ? `${short} ${vol} · ${p.units} pack` : `${short} ${vol}`;
}
