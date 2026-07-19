import { useState } from 'react';
import { CONTAINERS, ML_PRESETS, computeEntry, fmtMoney, fmtPerMl, fmtMl } from '../lib/calc.js';
import CatalogPicker from './CatalogPicker.jsx';

const INITIAL = {
  name: '',
  container: 'lata',
  mlPerUnit: '355',
  units: '6',
  price: '',
  priceMode: 'total',
  abv: '',
  store: '',
};

export default function BeerForm({ onAdd }) {
  const [form, setForm] = useState(INITIAL);
  const [location, setLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | loading | error

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const mlPerUnit = parseFloat(form.mlPerUnit);
  const units = parseInt(form.units, 10);
  const price = parseFloat(form.price);
  const abv = parseFloat(form.abv);
  const valid = mlPerUnit > 0 && units > 0 && price > 0;

  const preview = valid
    ? computeEntry({ mlPerUnit, units, price, priceMode: form.priceMode, abv })
    : null;

  function pickFromCatalog(brandItem, presentation) {
    setForm({
      ...form,
      name: `${brandItem.name} ${presentation.short}`,
      container: presentation.container,
      mlPerUnit: String(presentation.ml),
      units: String(presentation.units),
      abv: String(brandItem.abv),
    });
  }

  function captureLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('idle');
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim() || 'Sin nombre',
      container: form.container,
      mlPerUnit,
      units,
      price,
      priceMode: form.priceMode,
      abv: abv > 0 ? abv : null,
      store: form.store.trim(),
      location,
    });
    // Se conservan tienda y ubicación para capturar varias cervezas del mismo lugar
    setForm({ ...form, name: '', price: '', abv: '' });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Agregar cerveza</h2>

      <CatalogPicker onPick={pickFromCatalog} />

      <label>
        Marca / descripción
        <input
          type="text"
          placeholder="Ej. Indio six pack"
          value={form.name}
          onChange={set('name')}
        />
      </label>

      <div className="row">
        <label>
          Presentación
          <select value={form.container} onChange={set('container')}>
            {CONTAINERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Envases
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={form.units}
            onChange={set('units')}
            required
          />
        </label>
      </div>

      <label>
        Mililitros por envase
        <input
          type="number"
          min="1"
          step="any"
          inputMode="decimal"
          value={form.mlPerUnit}
          onChange={set('mlPerUnit')}
          required
        />
      </label>
      <div className="presets" role="group" aria-label="Volúmenes comunes">
        {ML_PRESETS.map((ml) => (
          <button
            key={ml}
            type="button"
            className={form.mlPerUnit === String(ml) ? 'preset active' : 'preset'}
            onClick={() => setForm({ ...form, mlPerUnit: String(ml) })}
          >
            {ml}
          </button>
        ))}
      </div>

      <div className="row">
        <label>
          Precio (MXN)
          <input
            type="number"
            min="0.01"
            step="any"
            inputMode="decimal"
            placeholder="0.00"
            value={form.price}
            onChange={set('price')}
            required
          />
        </label>

        <label>
          El precio es
          <select value={form.priceMode} onChange={set('priceMode')}>
            <option value="total">por paquete (total)</option>
            <option value="unit">por envase</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          Alcohol % (opcional)
          <input
            type="number"
            min="0"
            max="70"
            step="any"
            inputMode="decimal"
            placeholder="Ej. 4.5"
            value={form.abv}
            onChange={set('abv')}
          />
        </label>

        <label>
          Tienda (opcional)
          <input
            type="text"
            placeholder="Ej. OXXO Centro"
            value={form.store}
            onChange={set('store')}
          />
        </label>
      </div>

      <div className="geo-row">
        {location ? (
          <>
            <span className="geo-ok">📍 Ubicación guardada</span>
            <button type="button" className="ghost" onClick={() => setLocation(null)}>
              Quitar
            </button>
          </>
        ) : (
          <button
            type="button"
            className="ghost"
            onClick={captureLocation}
            disabled={geoStatus === 'loading'}
          >
            {geoStatus === 'loading' ? 'Obteniendo ubicación…' : '📍 Agregar mi ubicación'}
          </button>
        )}
        {geoStatus === 'error' && (
          <span className="geo-error">No se pudo obtener la ubicación</span>
        )}
      </div>

      {preview && (
        <div className="preview">
          <div>
            <span className="preview-big">{fmtPerMl(preview.perMl)}</span> / ml
          </div>
          <div className="preview-sub">
            {fmtMoney(preview.perLiter)} por litro · {fmtMl(preview.totalMl)} en total ·{' '}
            {fmtMoney(preview.totalPrice)}
            {preview.perLiterAlcohol && (
              <> · {fmtMoney(preview.perLiterAlcohol)} por litro de alcohol</>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="primary" disabled={!valid}>
        Agregar al comparativo
      </button>
    </form>
  );
}
