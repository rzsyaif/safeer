import { useEffect, useState } from 'react';
import { useSettings } from '../lib/settings';
import { useNow } from '../lib/useNow';
import { currentPrayer, fmtTime, getDayTimes, PRAYER_LABEL, PRAYER_ORDER } from '../lib/prayer';
import { permissionState, planReminders, requestPermission, scheduleAll } from '../lib/notifications';
import { toHijri } from '../lib/hijri';

export function Salat() {
  const { settings, update } = useSettings();
  const now = useNow(30_000);
  const { lat, lng, name } = settings.location;
  const { times, imsak } = getDayTimes(now, lat, lng, settings.imsakOffset);
  const cur = currentPrayer(now, times);
  const [perm, setPerm] = useState(permissionState());
  const [pending, setPending] = useState(0);

  useEffect(() => {
    setPending(scheduleAll(planReminders(settings)));
  }, [settings]);

  const toggle = (k: (typeof PRAYER_ORDER)[number]) =>
    update({ reminders: { ...settings.reminders, [k]: !settings.reminders[k] } });

  return (
    <main className="screen">
      <header>
        <h1 className="title-screen">Waktu Salat</h1>
        <p className="secondary">
          {name} · {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} ·{' '}
          {toHijri(now, settings.hijriOffset).label}
        </p>
      </header>

      {perm !== 'granted' && (
        <button
          className="banner"
          onClick={async () => setPerm(await requestPermission())}
          disabled={perm === 'unsupported' || perm === 'denied'}
        >
          {perm === 'unsupported'
            ? 'Notifikasi aktif penuh setelah dipasang sebagai aplikasi.'
            : perm === 'denied'
              ? 'Notifikasi diblokir. Izinkan di pengaturan perangkat.'
              : 'Ketuk untuk mengizinkan pengingat waktu salat.'}
        </button>
      )}

      <ul className="list">
        <li className="list-row subtle">
          <span>Imsak</span>
          <span className="time">{fmtTime(imsak)}</span>
          <span className="toggle-spacer" />
        </li>
        {PRAYER_ORDER.map((k) => (
          <li key={k} className={`list-row ${cur === k && k !== 'sunrise' ? 'current' : ''}`}>
            <span>
              {PRAYER_LABEL[k]}
              {cur === k && k !== 'sunrise' && <span className="chip live">● Sekarang</span>}
            </span>
            <span className="time">{fmtTime(times[k])}</span>
            <button
              className={`bell ${settings.reminders[k] ? 'on' : ''}`}
              aria-pressed={settings.reminders[k]}
              aria-label={`Pengingat ${PRAYER_LABEL[k]} ${settings.reminders[k] ? 'aktif' : 'mati'}`}
              onClick={() => toggle(k)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"
                  fill={settings.reminders[k] ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <p className="caption muted">
        Metode Kemenag RI (Subuh 20°, Isya 18°, ihtiyath 2 menit). {pending} pengingat terjadwal untuk {4} hari ke depan.
      </p>
    </main>
  );
}
