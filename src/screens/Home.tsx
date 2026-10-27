import { Link } from 'react-router-dom';
import { useSettings } from '../lib/settings';
import { useNow } from '../lib/useNow';
import { fmtCountdown, fmtTime, nextPrayer, PRAYER_LABEL } from '../lib/prayer';
import { seasonOf, toHijri } from '../lib/hijri';
import type { Season } from '../lib/hijri';

function greeting(h: number) {
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

function SeasonCard({ season }: { season: Season }) {
  const copy: Record<Season['kind'], { eyebrow: string; title: string; body: string }> = {
    shaban: {
      eyebrow: "Sya'ban",
      title: 'Tulis Rencana Ramadhanmu',
      body: `Ramadhan tinggal ±${season.kind === 'shaban' ? season.daysToRamadhan : ''} hari. Tulis sekali, Safeer yang mengingatkan.`,
    },
    ramadhan: {
      eyebrow: season.kind === 'ramadhan' ? `Ramadhan hari ke-${season.day}` : 'Ramadhan',
      title:
        season.kind === 'ramadhan' && season.last10
          ? '10 malam terakhir'
          : season.kind === 'ramadhan' && season.nearLast10
            ? '10 malam terakhir segera tiba'
            : "Amalan hari ini",
      body:
        season.kind === 'ramadhan' && season.last10
          ? 'Buka kembali rencana malammu.'
          : season.kind === 'ramadhan' && season.nearLast10
            ? 'Saatnya meninjau dan menguatkan rencanamu.'
            : 'Tetap sedikit, asal istiqamah.',
    },
    syawal: { eyebrow: 'Syawal', title: 'Puasa 6 hari Syawal', body: 'Catat puasa Syawalmu di tab Puasa.' },
    dzulhijjah10: { eyebrow: '10 hari pertama Dzulhijjah', title: 'Hari-hari terbaik di dunia', body: 'Perbanyak amal saleh. Puasa Arafah tanggal 9.' },
    tasyrik: { eyebrow: 'Hari Tasyrik', title: 'Hari makan, minum, dan dzikir', body: 'Tidak berpuasa pada 11–13 Dzulhijjah.' },
    normal: { eyebrow: 'Hari ini', title: 'Rencana amalmu', body: 'Rencana Ramadhan bisa ditulis mulai sekarang.' },
  };
  const c = copy[season.kind];
  return (
    <section className="card highlight">
      <p className="caption muted">{c.eyebrow}</p>
      <h2 className="title-card">{c.title}</h2>
      <p className="secondary">{c.body}</p>
      <button className="pill tonal" disabled title="Hadir di M2">
        Buat rencana · segera
      </button>
    </section>
  );
}

export function Home() {
  const { settings } = useSettings();
  const now = useNow();
  const { lat, lng, name } = settings.location;
  const next = nextPrayer(now, lat, lng, settings.imsakOffset);
  const hijri = toHijri(now, settings.hijriOffset);

  return (
    <main className="screen">
      <header className="row between">
        <div>
          <p className="secondary">{greeting(now.getHours())}</p>
          <h1 className="title-screen">Safeer</h1>
        </div>
        <Link to="/pengaturan" className="icon-btn" aria-label="Pengaturan">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      {next && (
        <section className="card prayer-card">
          <div className="row between">
            <span className="chip">Berikutnya</span>
            <span className="body-strong">{name}</span>
          </div>
          <div className="row between baseline">
            <h2 className="title-card">{PRAYER_LABEL[next.key]}</h2>
            <span className="secondary">{hijri.label}</span>
          </div>
          <p className="display-time">{fmtTime(next.time)}</p>
          <p className="secondary">{fmtCountdown(next.time.getTime() - now.getTime())} lagi</p>
          <Link to="/salat" className="card-footer">
            Lihat semua waktu salat <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      <SeasonCard season={seasonOf(hijri)} />

      <section>
        <h2 className="title-section">Amalan hari ini</h2>
        <div className="card empty">
          <span className="lantern dim" aria-hidden="true" />
          <p className="secondary">Belum ada amalan. Rencana dan pengingat amalan hadir di tahap berikutnya.</p>
        </div>
      </section>
    </main>
  );
}
