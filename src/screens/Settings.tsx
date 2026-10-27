import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../lib/settings';
import { Dua } from '../components/Dua';
import { DUA_BERBUKA } from '../content/duas';

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch-row">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function Settings() {
  const { settings, update, updateText } = useSettings();
  const { text } = settings;
  const [locMsg, setLocMsg] = useState('');

  const useGps = () => {
    if (!navigator.geolocation) return setLocMsg('Lokasi tidak didukung.');
    setLocMsg('Mencari lokasi…');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        update({ location: { lat: p.coords.latitude, lng: p.coords.longitude, name: 'Lokasi saya' } });
        setLocMsg('Lokasi diperbarui.');
      },
      () => setLocMsg('Tidak bisa mendapatkan lokasi. Periksa izin lokasi.'),
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  };

  return (
    <main className="screen">
      <header className="row gap">
        <Link to="/" className="icon-btn" aria-label="Kembali">‹</Link>
        <h1 className="title-screen">Pengaturan</h1>
      </header>

      <section className="card form">
        <h2 className="title-card">Tampilan teks</h2>
        <Switch label="Mode besar & sederhana" checked={settings.bigSimple} onChange={(v) => update({ bigSimple: v })} />
        <label className="field">
          <span>Ukuran teks · {Math.round(text.uiScale * 100)}%</span>
          <input type="range" min={0.9} max={1.6} step={0.1} value={text.uiScale} onChange={(e) => updateText({ uiScale: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Ukuran teks Arab · {text.arabicSize}px</span>
          <input type="range" min={22} max={52} step={2} value={text.arabicSize} onChange={(e) => updateText({ arabicSize: Number(e.target.value) })} />
        </label>
        <Switch label="Tampilkan teks Arab" checked={text.showArabic} onChange={(v) => updateText({ showArabic: v })} />
        <Switch label="Tampilkan latin" checked={text.showLatin} onChange={(v) => updateText({ showLatin: v })} />
        <Switch label="Tampilkan terjemahan" checked={text.showTranslation} onChange={(v) => updateText({ showTranslation: v })} />
        <div className="segmented" role="radiogroup" aria-label="Bahasa terjemahan">
          {(['id', 'en'] as const).map((l) => (
            <button key={l} role="radio" aria-checked={text.translationLang === l} className={text.translationLang === l ? 'active' : ''} onClick={() => updateText({ translationLang: l })}>
              {l === 'id' ? 'Indonesia' : 'English'}
            </button>
          ))}
        </div>
      </section>

      <p className="caption muted">Pratinjau</p>
      <Dua dua={DUA_BERBUKA} />

      <section className="card form">
        <h2 className="title-card">Waktu & lokasi</h2>
        <p className="secondary">{settings.location.name} ({settings.location.lat.toFixed(3)}, {settings.location.lng.toFixed(3)})</p>
        <button className="pill outline" onClick={useGps}>Gunakan lokasi saat ini</button>
        {locMsg && <p className="caption muted">{locMsg}</p>}
        <label className="field">
          <span>Imsak · {settings.imsakOffset} menit sebelum Subuh</span>
          <input type="range" min={0} max={15} step={1} value={settings.imsakOffset} onChange={(e) => update({ imsakOffset: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Pengingat sebelum salat · {settings.preReminder ? `${settings.preReminder} menit` : 'mati'}</span>
          <input type="range" min={0} max={30} step={5} value={settings.preReminder} onChange={(e) => update({ preReminder: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Koreksi tanggal Hijriah · {settings.hijriOffset > 0 ? '+' : ''}{settings.hijriOffset} hari</span>
          <input type="range" min={-2} max={2} step={1} value={settings.hijriOffset} onChange={(e) => update({ hijriOffset: Number(e.target.value) })} />
        </label>
      </section>
    </main>
  );
}
