// Small on-device key/value store.
// M1 uses localStorage; M2 moves records (plans, logs) to IndexedDB behind the same API.

const PREFIX = 'safeer:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode etc.) — app keeps working in memory
  }
}
