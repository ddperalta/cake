import { useState } from 'react';
import { computeEntry, containerLabel, fmtMoney, fmtPerMl, fmtMl, mapsUrl } from '../lib/calc.js';
import { shareUrl } from '../lib/share.js';

const METRICS = {
  perLiter: { label: '$ / litro', unit: 'por litro' },
  perLiterAlcohol: { label: '$ / L de alcohol', unit: 'por litro de alcohol' },
};

export default function ComparisonTable({ entries, onRemove, onClear }) {
  const [metric, setMetric] = useState('perLiter');
  const [shared, setShared] = useState(false);

  if (entries.length === 0) {
    return (
      <div className="card empty">
        <h2>Comparativo</h2>
        <p>Agrega dos o más cervezas para ver cuál conviene. 🍻</p>
      </div>
    );
  }

  const sortVal = (r) => (r[metric] == null ? Infinity : r[metric]);
  const rows = entries
    .map((e) => ({ ...e, ...computeEntry(e) }))
    .sort((a, b) => sortVal(a) - sortVal(b));

  const best = rows[0];
  const ranked = rows.filter((r) => r[metric] != null);
  const worst = ranked[ranked.length - 1];

  async function handleShare() {
    const url = shareUrl(entries);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Comparativo de cervezas 🍺', url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // compartir cancelado por el usuario
    }
  }

  return (
    <div className="card">
      <div className="table-head">
        <h2>Comparativo</h2>
        <div className="table-actions">
          <div className="toggle" role="group" aria-label="Ordenar por">
            {Object.entries(METRICS).map(([key, m]) => (
              <button
                key={key}
                type="button"
                className={metric === key ? 'toggle-btn active' : 'toggle-btn'}
                onClick={() => setMetric(key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button type="button" className="ghost" onClick={handleShare}>
            {shared ? '✓ Enlace copiado' : '🔗 Compartir'}
          </button>
          <button type="button" className="ghost" onClick={onClear}>
            Limpiar todo
          </button>
        </div>
      </div>

      <ul className="cards">
        {rows.map((r) => {
          const isBest = r.id === best.id && r[metric] != null;
          const diff =
            r[metric] == null ? null : ((r[metric] - best[metric]) / best[metric]) * 100;
          return (
            <li key={r.id} className={isBest ? 'bcard best' : 'bcard'}>
              <div className="bcard-top">
                <span className="bcard-name">
                  {isBest && <span title="Mejor precio">🏆 </span>}
                  {r.name}
                </span>
                <span className="bcard-price">
                  {fmtMoney(r.perLiter)}
                  <small>/L</small>
                </span>
              </div>
              <div className="bcard-sub">
                {containerLabel(r.container)} × {r.units} de {r.mlPerUnit} ml · {fmtMl(r.totalMl)}{' '}
                · {fmtMoney(r.totalPrice)}
              </div>
              <div className="bcard-sub">
                {fmtPerMl(r.perMl)}/ml
                {r.perLiterAlcohol != null && <> · {fmtMoney(r.perLiterAlcohol)}/L de alcohol</>}
                {r.store && (
                  <>
                    {' '}
                    · {r.store}
                    {r.location && (
                      <>
                        {' '}
                        <a
                          href={mapsUrl(r.location)}
                          target="_blank"
                          rel="noreferrer"
                          title="Ver en Google Maps"
                        >
                          📍
                        </a>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="bcard-foot">
                <span className={isBest ? 'bcard-diff best' : 'bcard-diff'}>
                  {diff == null
                    ? 'Sin % de alcohol'
                    : isBest
                      ? 'Mejor precio'
                      : `+${diff.toFixed(1)}% vs. mejor`}
                </span>
                <button
                  type="button"
                  className="ghost danger"
                  onClick={() => onRemove(r.id)}
                  aria-label={`Eliminar ${r.name}`}
                >
                  ✕ Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Cerveza</th>
              <th>Tienda</th>
              <th>Presentación</th>
              <th>Volumen</th>
              <th>Precio</th>
              <th className="num">$/L</th>
              <th className="num">$/ml</th>
              <th className="num">$/L alc.</th>
              <th className="num">vs. mejor</th>
              <th aria-label="Acciones"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isBest = r.id === best.id && r[metric] != null;
              const diff =
                r[metric] == null
                  ? null
                  : ((r[metric] - best[metric]) / best[metric]) * 100;
              return (
                <tr key={r.id} className={isBest ? 'best' : ''}>
                  <td>
                    {isBest && <span title="Mejor precio">🏆 </span>}
                    {r.name}
                  </td>
                  <td>
                    {r.store || '—'}
                    {r.location && (
                      <>
                        {' '}
                        <a
                          href={mapsUrl(r.location)}
                          target="_blank"
                          rel="noreferrer"
                          title="Ver en Google Maps"
                        >
                          📍
                        </a>
                      </>
                    )}
                  </td>
                  <td>
                    {containerLabel(r.container)} × {r.units} de {r.mlPerUnit} ml
                  </td>
                  <td>{fmtMl(r.totalMl)}</td>
                  <td>{fmtMoney(r.totalPrice)}</td>
                  <td className="num">{fmtMoney(r.perLiter)}</td>
                  <td className="num">{fmtPerMl(r.perMl)}</td>
                  <td className="num">
                    {r.perLiterAlcohol == null ? '—' : fmtMoney(r.perLiterAlcohol)}
                  </td>
                  <td className="num">
                    {diff == null ? '—' : isBest ? '—' : `+${diff.toFixed(1)}%`}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ghost danger"
                      onClick={() => onRemove(r.id)}
                      aria-label={`Eliminar ${r.name}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {ranked.length > 1 && (
        <p className="verdict">
          🏆 <strong>{best.name}</strong> es la más barata: {fmtMoney(best[metric])}{' '}
          {METRICS[metric].unit}. La más cara sale{' '}
          <strong>+{(((worst[metric] - best[metric]) / best[metric]) * 100).toFixed(1)}%</strong>{' '}
          más.
        </p>
      )}
      {metric === 'perLiterAlcohol' && rows.some((r) => r.perLiterAlcohol == null) && (
        <p className="hint">
          Las cervezas sin % de alcohol capturado no participan en este orden.
        </p>
      )}
    </div>
  );
}
