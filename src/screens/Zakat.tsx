import { useState } from 'react';
import { load, save } from '../lib/storage';

const rupiah = (n: number) => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function Zakat() {
  const saved = load('zakat-fitrah', { people: 1, mode: 'money' as 'money' | 'rice', perPerson: 0 });
  const [people, setPeople] = useState(saved.people);
  const [mode, setMode] = useState(saved.mode);
  const [perPerson, setPerPerson] = useState(saved.perPerson);

  const persist = (p = people, m = mode, v = perPerson) => save('zakat-fitrah', { people: p, mode: m, perPerson: v });

  return (
    <main className="screen">
      <header>
        <h1 className="title-screen">Zakat</h1>
        <p className="secondary">Kalkulator zakat fitrah</p>
      </header>

      <section className="card form">
        <label className="field">
          <span>Jumlah anggota keluarga</span>
          <div className="stepper">
            <button className="icon-btn" aria-label="Kurangi" onClick={() => { const v = Math.max(1, people - 1); setPeople(v); persist(v); }}>−</button>
            <output aria-live="polite">{people}</output>
            <button className="icon-btn" aria-label="Tambah" onClick={() => { const v = people + 1; setPeople(v); persist(v); }}>+</button>
          </div>
        </label>

        <div className="segmented" role="radiogroup" aria-label="Bentuk zakat">
          {(['rice', 'money'] as const).map((m) => (
            <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'active' : ''} onClick={() => { setMode(m); persist(people, m); }}>
              {m === 'rice' ? 'Beras' : 'Uang'}
            </button>
          ))}
        </div>

        {mode === 'money' && (
          <label className="field">
            <span>Nilai per jiwa (Rp)</span>
            <input
              inputMode="numeric"
              value={perPerson ? perPerson.toLocaleString('id-ID') : ''}
              placeholder="mis. 47.000"
              onChange={(e) => { const v = Number(e.target.value.replace(/\D/g, '')); setPerPerson(v); persist(people, mode, v); }}
            />
            <small className="muted">Gunakan nilai yang ditetapkan BAZNAS atau pemerintah daerahmu tahun ini.</small>
          </label>
        )}
      </section>

      <section className="card highlight">
        <p className="caption muted">Total zakat fitrah</p>
        <p className="display-time">
          {mode === 'rice' ? `${(people * 2.5).toLocaleString('id-ID')} kg` : rupiah(people * perPerson)}
        </p>
        <p className="secondary">
          {mode === 'rice' ? `${people} jiwa × 2,5 kg beras (±1 sha')` : `${people} jiwa × ${rupiah(perPerson)}`}
        </p>
        <p className="caption muted">Ditunaikan sebelum salat Idulfitri.</p>
      </section>

      <section className="card">
        <h2 className="title-card">Segera hadir</h2>
        <p className="secondary">Kalkulator zakat maal (nisab 85 g emas) dan catatan sedekah.</p>
      </section>
    </main>
  );
}
