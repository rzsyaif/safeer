import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { load, save } from './storage';
import type { PrayerKey } from './prayer';

export type TranslationLang = 'id' | 'en';

export interface Settings {
  location: { lat: number; lng: number; name: string };
  /** Minutes before Subuh for imsak (Kemenag convention: 10). */
  imsakOffset: number;
  /** Shift the Hijri date to match local sighting (Indonesia often differs from Umm al-Qura). */
  hijriOffset: number;
  /** Per-prayer reminder toggles. */
  reminders: Record<PrayerKey, boolean>;
  /** Minutes before the prayer for a pre-reminder (0 = off). */
  preReminder: number;
  text: {
    uiScale: number; // 1 = 16px base
    arabicSize: number; // px
    showArabic: boolean;
    showLatin: boolean;
    showTranslation: boolean;
    translationLang: TranslationLang;
  };
  bigSimple: boolean;
  hajjMode: 'hajj' | 'umrah';
}

export const defaultSettings: Settings = {
  location: { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
  imsakOffset: 10,
  hijriOffset: 0,
  reminders: { fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true },
  preReminder: 0,
  text: {
    uiScale: 1,
    arabicSize: 30,
    showArabic: true,
    showLatin: true,
    showTranslation: true,
    translationLang: 'id',
  },
  bigSimple: false,
  hajjMode: 'hajj',
};

interface Ctx {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  updateText: (patch: Partial<Settings['text']>) => void;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const s = load('settings', defaultSettings);
    return { ...s, text: { ...defaultSettings.text, ...s.text } };
  });

  useEffect(() => {
    save('settings', settings);
    const root = document.documentElement;
    const scale = settings.bigSimple ? Math.max(settings.text.uiScale, 1.2) : settings.text.uiScale;
    root.style.setProperty('--ui-scale', String(scale));
    root.style.setProperty('--arabic-size', `${settings.bigSimple ? Math.max(settings.text.arabicSize, 36) : settings.text.arabicSize}px`);
    root.dataset.bigSimple = String(settings.bigSimple);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const updateText = (patch: Partial<Settings['text']>) =>
    setSettings((s) => ({ ...s, text: { ...s.text, ...patch } }));

  return <SettingsContext.Provider value={{ settings, update, updateText }}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings outside SettingsProvider');
  return ctx;
}
