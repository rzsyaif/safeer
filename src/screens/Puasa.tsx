import { useSettings } from '../lib/settings';
import { useNow } from '../lib/useNow';
import { fmtCountdown, fmtTime, getDayTimes } from '../lib/prayer';
import { Dua } from '../components/Dua';
import { DUA_BERBUKA } from '../content/duas';

export function Puasa() {
  const { settings } = useSettings();
  const now = useNow();
  const { lat, lng } = settings.location;
  const today = getDayTimes(now, lat, lng, settings.imsakOffset);
  const tomorrow = getDayTimes(new Date(now.getTime() + 86_400_000), lat, lng, settings.imsakOffset);

  const fasting = now >= today.imsak && now < today.times.maghrib;
  const target = fasting ? today.times.maghrib : now < today.imsak ? today.imsak : tomorrow.imsak;

  return (
    <main className="screen">
      <header>
        <h1 className="title-screen">Puasa</h1>
      </header>

      <section className="card prayer-card">
        <span className="chip">{fasting ? 'Menuju berbuka' : 'Menuju imsak'}</span>
        <p className="display-time">{fmtCountdown(target.getTime() - now.getTime())}</p>
        <div className="row between">
          <span className="secondary">Imsak {fmtTime(fasting || now < today.imsak ? today.imsak : tomorrow.imsak)}</span>
          <span className="secondary">Berbuka {fmtTime(today.times.maghrib)}</span>
        </div>
      </section>

      <Dua dua={DUA_BERBUKA} />

      <section className="card">
        <h2 className="title-card">Segera hadir</h2>
        <p className="secondary">Catatan puasa harian, utang puasa (qadha), dan kalender puasa sunnah: Senin–Kamis, Ayyamul Bidh, 6 Syawal, Arafah, dan 'Asyura.</p>
      </section>
    </main>
  );
}
