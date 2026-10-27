# Safeer

The ultimate deen guide — Salah, Zakat, Fasting (Ramadhan) and Hajj/Umrah in one calm, offline-first app for iPhone and Android.

- Product spec: [`docs/PRD.md`](docs/PRD.md)
- Stack: React + TypeScript + Vite → Capacitor (iOS/Android) for native local notifications
- All data stays on the device. Prayer times are computed offline (Kemenag RI parameters).

## Run it

```bash
npm install
npm run dev        # open the printed URL; use your browser's phone view
npm run build      # production build into dist/
```

## Structure

```
src/
  lib/           prayer times, Hijri calendar & seasons, settings, notifications (single module), storage
  screens/       Home (Beranda), Salat, Zakat, Puasa, Haji, Settings (Pengaturan)
  components/    BottomNav, Dua (respects text settings)
  content/       du'a texts — pending ustadz review
  styles/        tokens.css (from DESIGN.md), app.css
```

Religious content must be reviewed by a qualified ustadz before release.
