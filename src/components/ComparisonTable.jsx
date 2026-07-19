import { computeEntry, containerLabel, fmtMoney, fmtPerMl, fmtMl } from '../lib/calc.js';

export default function ComparisonTable({ entries, onRemove, onClear }) {
  if (entries.length === 0) {
    return (
      <div className="card empty">
        <h2>Comparativo</h2>
        <p>Agrega dos o más cervezas para ver cuál conviene. 🍻</p>
      </div>
    );
  }

  const rows = entries
    .map((e) => ({ ...e, ...computeEntry(e) }))
    .sort((a, b) => a.perLiter - b.perLiter);

  const best = rows[0];

  return (
    <div className="card">
      <div className="table-head">
        <h2>Comparativo</h2>
        <button type="button" className="ghost" onClick={onClear}>
          Limpiar todo
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Cerveza</th>
              <th>Presentación</th>
              <th>Volumen</th>
              <th>Precio</th>
              <th>$/L</th>
              <th>$/ml</th>
              <th>vs. mejor</th>
              <th aria-label="Acciones"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isBest = r.id === best.id;
              const diff = ((r.perLiter - best.perLiter) / best.perLiter) * 100;
              return (
                <tr key={r.id} className={isBest ? 'best' : ''}>
                  <td>
                    {isBest && <span title="Mejor precio">🏆 </span>}
                    {r.name}
                  </td>
                  <td>
                    {containerLabel(r.container)} × {r.units} de {r.mlPerUnit} ml
                  </td>
                  <td>{fmtMl(r.totalMl)}</td>
                  <td>{fmtMoney(r.totalPrice)}</td>
                  <td className="num">{fmtMoney(r.perLiter)}</td>
                  <td className="num">{fmtPerMl(r.perMl)}</td>
                  <td className="num">
                    {isBest ? '—' : `+${diff.toFixed(1)}%`}
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

      {rows.length > 1 && (
        <p className="verdict">
          🏆 <strong>{best.name}</strong> es la más barata: {fmtMoney(best.perLiter)} por litro.
          La más cara sale{' '}
          <strong>
            +{(((rows[rows.length - 1].perLiter - best.perLiter) / best.perLiter) * 100).toFixed(1)}%
          </strong>{' '}
          más.
        </p>
      )}
    </div>
  );
}
