// Hijri date via the platform's Umm al-Qura calendar, with a user offset
// so Indonesian users can align with the Kemenag isbat decision.

export interface HijriDate {
  day: number;
  month: number; // 1 = Muharram … 9 = Ramadhan … 12 = Dhul Hijjah
  year: number;
  label: string;
}

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir',
  'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah',
];

export function toHijri(date: Date, offsetDays = 0): HijriDate {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ''));
    const day = get('day');
    const month = get('month');
    const year = get('year');
    return { day, month, year, label: `${day} ${HIJRI_MONTHS[month - 1]} ${year} H` };
  } catch {
    return { day: 0, month: 0, year: 0, label: '' };
  }
}

export type Season =
  | { kind: 'shaban'; daysToRamadhan: number }
  | { kind: 'ramadhan'; day: number; last10: boolean; nearLast10: boolean }
  | { kind: 'syawal'; day: number }
  | { kind: 'dzulhijjah10'; day: number }
  | { kind: 'tasyrik'; day: number }
  | { kind: 'normal' };

export function seasonOf(h: HijriDate): Season {
  if (h.month === 8) return { kind: 'shaban', daysToRamadhan: Math.max(1, 30 - h.day) };
  if (h.month === 9) return { kind: 'ramadhan', day: h.day, last10: h.day >= 21, nearLast10: h.day >= 18 && h.day <= 20 };
  if (h.month === 10) return { kind: 'syawal', day: h.day };
  if (h.month === 12 && h.day <= 10) return { kind: 'dzulhijjah10', day: h.day };
  if (h.month === 12 && h.day <= 13) return { kind: 'tasyrik', day: h.day };
  return { kind: 'normal' };
}
