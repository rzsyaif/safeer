import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_ORDER: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_LABEL: Record<PrayerKey, string> = {
  fajr: 'Subuh',
  sunrise: 'Terbit',
  dhuhr: 'Zuhur',
  asr: 'Asar',
  maghrib: 'Magrib',
  isha: 'Isya',
};

export interface DayTimes {
  date: Date;
  imsak: Date;
  times: Record<PrayerKey, Date>;
}

/**
 * Kemenag RI parameters: Subuh 20°, Isya 18°, Asar standard shadow,
 * plus 2-minute ihtiyath (safety margin) as used in Kemenag schedules.
 */
function kemenagParams() {
  const p = CalculationMethod.Other();
  p.fajrAngle = 20;
  p.ishaAngle = 18;
  p.madhab = Madhab.Shafi;
  p.adjustments = { fajr: 2, sunrise: -2, dhuhr: 2, asr: 2, maghrib: 2, isha: 2 };
  return p;
}

export function getDayTimes(date: Date, lat: number, lng: number, imsakOffset: number): DayTimes {
  const pt = new PrayerTimes(new Coordinates(lat, lng), date, kemenagParams());
  const times: Record<PrayerKey, Date> = {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
  return { date, times, imsak: new Date(pt.fajr.getTime() - imsakOffset * 60_000) };
}

/** The next prayer (excluding sunrise) after `now`, looking into tomorrow if needed. */
export function nextPrayer(now: Date, lat: number, lng: number, imsakOffset: number) {
  for (let d = 0; d < 2; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const { times } = getDayTimes(day, lat, lng, imsakOffset);
    for (const key of PRAYER_ORDER) {
      if (key === 'sunrise') continue;
      if (times[key] > now) return { key, time: times[key] };
    }
  }
  return null;
}

/** The prayer whose time we are currently in (for the "Sekarang" chip). */
export function currentPrayer(now: Date, times: Record<PrayerKey, Date>): PrayerKey | null {
  let cur: PrayerKey | null = null;
  for (const key of PRAYER_ORDER) if (times[key] <= now) cur = key;
  return cur;
}

export function fmtTime(d: Date) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function fmtCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h} j ${m} m`;
  if (m > 0) return `${m} m ${s} d`;
  return `${s} d`;
}
