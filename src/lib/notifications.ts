// The ONLY place that talks to the notification system.
// Web (dev): Notification API + in-session timers — good enough to test copy and timing.
// Native (M2): swap `backend` for @capacitor/local-notifications; nothing else changes.

import { getDayTimes, PRAYER_LABEL, PRAYER_ORDER } from './prayer';
import type { Settings } from './settings';

export interface Reminder {
  id: number;
  fireAt: Date;
  title: string;
  body: string;
  kind: 'prayer' | 'pre-prayer' | 'imsak' | 'amal';
}

/** iOS keeps at most 64 pending local notifications; stay under it. */
export const MAX_PENDING = 60;
/** How many days ahead the rolling window covers. Refilled on every app open. */
export const WINDOW_DAYS = 4;

export function planReminders(settings: Settings, from = new Date()): Reminder[] {
  const out: Reminder[] = [];
  const { lat, lng } = settings.location;
  for (let d = 0; d < WINDOW_DAYS; d++) {
    const day = new Date(from);
    day.setDate(day.getDate() + d);
    const { times } = getDayTimes(day, lat, lng, settings.imsakOffset);
    for (const key of PRAYER_ORDER) {
      if (!settings.reminders[key]) continue;
      const at = times[key];
      const stamp = Number(`${day.getMonth() + 1}${String(day.getDate()).padStart(2, '0')}${PRAYER_ORDER.indexOf(key)}`);
      if (settings.preReminder > 0 && key !== 'sunrise') {
        out.push({
          id: stamp * 10 + 1,
          fireAt: new Date(at.getTime() - settings.preReminder * 60_000),
          title: `${settings.preReminder} menit lagi ${PRAYER_LABEL[key]}`,
          body: 'Bersiaplah untuk salat.',
          kind: 'pre-prayer',
        });
      }
      out.push({
        id: stamp * 10,
        fireAt: at,
        title: key === 'sunrise' ? 'Matahari terbit' : `Waktu ${PRAYER_LABEL[key]} telah masuk`,
        body: key === 'sunrise' ? 'Batas akhir waktu Subuh.' : 'Mari tunaikan salat.',
        kind: 'prayer',
      });
    }
  }
  return out
    .filter((r) => r.fireAt > from)
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
    .slice(0, MAX_PENDING);
}

// ---- backend (web) ----

const timers = new Map<number, number>();

export async function requestPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

export function permissionState(): NotificationPermission | 'unsupported' {
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

function show(r: Reminder) {
  if (permissionState() === 'granted') new Notification(r.title, { body: r.body, icon: '/favicon.svg', tag: String(r.id) });
}

/** Replace all pending reminders with `list`. */
export function scheduleAll(list: Reminder[]) {
  timers.forEach((t) => clearTimeout(t));
  timers.clear();
  const now = Date.now();
  for (const r of list) {
    const delay = r.fireAt.getTime() - now;
    // browsers clamp very long timeouts; the window is refilled on next open anyway
    if (delay > 0 && delay < 2 ** 31 - 1) timers.set(r.id, window.setTimeout(() => show(r), delay));
  }
  return list.length;
}
