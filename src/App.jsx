import { useEffect, useState } from 'react';
import BeerForm from './components/BeerForm.jsx';
import ComparisonTable from './components/ComparisonTable.jsx';

const STORAGE_KEY = 'cheve-calc:entries';

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [entries, setEntries] = useState(loadEntries);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  return (
    <div className="app">
      <header>
        <h1>🍺 ChevecCalc</h1>
        <p>Calcula el precio por mililitro y descubre qué cerveza conviene más.</p>
      </header>

      <main>
        <BeerForm onAdd={(entry) => setEntries([...entries, entry])} />
        <ComparisonTable
          entries={entries}
          onRemove={(id) => setEntries(entries.filter((e) => e.id !== id))}
          onClear={() => setEntries([])}
        />
      </main>

      <footer>
        <p>Los datos se guardan en tu navegador. Bebe con moderación. 🍻</p>
      </footer>
    </div>
  );
}
