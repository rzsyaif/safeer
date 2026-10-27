import { useEffect, useState } from 'react';
import { useSettings } from '../lib/settings';
import { load, save } from '../lib/storage';
import { Dua } from '../components/Dua';
import { DUA_RUKUN_YAMANI } from '../content/duas';

type CounterKind = 'tawaf' | 'sai';

function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock.request('screen').then((l) => (lock = l)).catch(() => {});
    return () => void lock?.release();
  }, [active]);
}

function Counter({ kind }: { kind: CounterKind }) {
  const [count, setCount] = useState(() => load(`counter-${kind}`, { n: 0 }).n);
  useWakeLock(count > 0 && count < 7);
  useEffect(() => save(`counter-${kind}`, { n: count }), [kind, count]);

  const tap = () => {
    if (count >= 7) return;
    setCount(count + 1);
    navigator.vibrate?.(count + 1 === 7 ? [120, 80, 120, 80, 240] : 80);
  };

  const label = kind === 'tawaf' ? 'putaran tawaf' : "perjalanan sa'i";
  const sub = kind === 'sai' ? (count % 2 === 0 ? 'Mulai dari Shafa' : 'Menuju Shafa dari Marwah') : '';

  return (
    <section className="counter-wrap">
      <button className={`counter ${count >= 7 ? 'done' : ''}`} onClick={tap} aria-live="polite">
        <span className="counter-n">{count}</span>
        <span className="counter-of">dari 7 {label}</span>
        {count >= 7 ? <span className="secondary">Selesai, alhamdulillah</span> : <span className="secondary">{sub || 'Ketuk setiap selesai satu putaran'}</span>}
      </button>
      <div className="row gap">
        <button className="pill outline" onClick={() => setCount(Math.max(0, count - 1))} disabled={count === 0}>Batalkan 1</button>
        <button className="pill tonal" onClick={() => setCount(0)} disabled={count === 0}>Mulai ulang</button>
      </div>
    </section>
  );
}

export function Haji() {
  const { settings, update } = useSettings();
  const [kind, setKind] = useState<CounterKind>('tawaf');

  return (
    <main className="screen">
      <header className="row between">
        <h1 className="title-screen">{settings.hajjMode === 'hajj' ? 'Haji' : 'Umrah'}</h1>
        <div className="segmented small" role="radiogroup" aria-label="Mode">
          {(['hajj', 'umrah'] as const).map((m) => (
            <button key={m} role="radio" aria-checked={settings.hajjMode === m} className={settings.hajjMode === m ? 'active' : ''} onClick={() => update({ hajjMode: m })}>
              {m === 'hajj' ? 'Haji' : 'Umrah'}
            </button>
          ))}
        </div>
      </header>

      <div className="segmented" role="tablist">
        {(['tawaf', 'sai'] as const).map((k) => (
          <button key={k} role="tab" aria-selected={kind === k} className={kind === k ? 'active' : ''} onClick={() => setKind(k)}>
            {k === 'tawaf' ? 'Tawaf' : "Sa'i"}
          </button>
        ))}
      </div>

      <Counter key={kind} kind={kind} />

      {kind === 'tawaf' && <Dua dua={DUA_RUKUN_YAMANI} />}

      <section className="card">
        <h2 className="title-card">Manasik hari demi hari</h2>
        <p className="secondary">Panduan 8–13 Dzulhijjah, doa tiap tempat, daftar periksa, dan kartu darurat sedang disusun dari buku Kemenag dan menunggu tinjauan ustadz.</p>
      </section>
    </main>
  );
}
