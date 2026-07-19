import { useState } from 'react';
import { BRANDS, presentationLabel } from '../lib/catalog.js';

export default function CatalogPicker({ onPick }) {
  const [query, setQuery] = useState('');
  const [openBrand, setOpenBrand] = useState(null);

  const q = query.trim().toLowerCase();
  const brands = q ? BRANDS.filter((b) => b.name.toLowerCase().includes(q)) : BRANDS;

  return (
    <details className="catalog">
      <summary>📚 Catálogo rápido · {BRANDS.length} marcas</summary>

      <input
        type="search"
        placeholder="Buscar marca…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar marca"
      />

      <ul className="catalog-list">
        {brands.map((b) => {
          const open = openBrand === b.name;
          return (
            <li key={b.name}>
              <button
                type="button"
                className={open ? 'catalog-brand open' : 'catalog-brand'}
                aria-expanded={open}
                onClick={() => setOpenBrand(open ? null : b.name)}
              >
                <span>{b.name}</span>
                <span className="catalog-abv">
                  {b.abv}% <span className="catalog-caret">{open ? '▾' : '▸'}</span>
                </span>
              </button>
              {open && (
                <div className="catalog-pres">
                  {b.presentations.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      className="preset"
                      onClick={() => onPick(b, p)}
                    >
                      {presentationLabel(p)}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
        {brands.length === 0 && <li className="hint">No hay marcas con ese nombre.</li>}
      </ul>
    </details>
  );
}
