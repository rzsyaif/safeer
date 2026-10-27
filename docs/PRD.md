# Safeer — Product Requirements Document

> **Safeer** (سفير, "envoy / guide") — the ultimate deen guide.
> One app for daily practice, Ramadhan, zakat and hajj/umrah. Built first for a real user pair: Kiki (iPhone) and Kiki's mother (Xiaomi POCO X5, Android).

Status: v0.1 draft · Owner: Kiki · Target: Ramadhan 1448 (≈ 8 Feb 2027) and Hajj 1448 (Arafah ≈ 15 May 2027)

---

## 1. Why this exists

Insights from the primary user (Kiki's mother, working full-time):

1. **Consistency is the core struggle.** Between work and multitasking, Ramadhan practices depend on her own memory, and they slip.
2. **She loses her plan near the end of Ramadhan**, exactly when the last 10 nights matter most.
3. **She wants a place to write her plan** for the month (a note/journal) and be **reminded of it**.
4. Text must be adjustable: size, Arabic, Latin transliteration and translation, especially for the Qur'an.

So the product north star is:

> **Write your plan once; Safeer remembers it for you — and reminds you at the right moment, especially when it matters most.**

Product philosophy is inherited from Istiqamah: **Niyyah → Amal → Istiqamah → Reflection → Repeat**. Optimise for istiqamah, not streaks. Minimum counts. Returning is success. No XP, badges, scores or spiritual metrics. The lantern metaphor marks effort (dim = skipped, steady = minimum, warm glow = extra).

## 2. Platform & architecture

| Decision | Choice | Reason |
|---|---|---|
| Codebase | React + TypeScript + Vite | One codebase, Kiki's own stack |
| Native shell | Capacitor (iOS + Android), added after the web MVP | Real **local** notifications, custom sounds, exact alarms, offline |
| Storage | On-device (IndexedDB) — no account, no backend | Privacy, works offline in Makkah/Mina |
| Prayer times | `adhan` computed offline from location | No network needed |
| Notifications | One `notifications` module; web fallback in dev, `@capacitor/local-notifications` in native | Swap with no app-wide changes |

### Notification rules
- Reminders are **scheduled on the device**, never pushed from a server.
- iOS allows 64 pending notifications → the app keeps a **rolling window** (next ~3–5 days) and refills it on every open and at a daily background tick.
- Android (Xiaomi HyperOS on POCO X5): first-run **guided setup** for Autostart, Battery saver → "No restrictions", "Alarms & reminders" (exact alarms), and notification permission. Show pictures per step.
- Prayer-linked 'amal reminders ride on the prayer notification where possible ("Maghrib has entered — after prayer: read 1 juz"), to avoid notification noise (Istiqamah §10.1).

## 3. Information architecture — the five pillars

Bottom navigation (Indonesian labels by default):

| Tab | Pillar | Purpose |
|---|---|---|
| **Beranda** | Shahadah (foundation) | Seasonal home: next prayer, season card, today's 'amal, Qur'an, du'a & dzikir |
| **Salat** | Salah | Prayer times, adhan reminders, qibla, tarawih/qiyam, dzikir after salah |
| **Zakat** | Zakat | Zakat fitrah calculator, zakat maal calculator, sedekah log |
| **Puasa** | Sawm | Imsak/iftar countdown, fasting log, qadha tracker, sunnah fasts calendar |
| **Haji** | Hajj | Hajj/Umrah toggle, day-by-day manasik, tawaf & sa'i counters, du'a per station, checklists, emergency card |

### Seasonal Home (Beranda)
The top card changes with the Hijri calendar:
- **Sha'ban:** "Write your Ramadhan Plan" invitation.
- **Ramadhan 1–19:** imsak/iftar countdown + today's plan items.
- **Ramadhan 18–20:** "The last 10 nights are coming" — revisit and strengthen the plan.
- **Ramadhan 21–30:** last-10-nights mode (night plan, odd-night cue, i'tikaf notes); zakat fitrah reminder.
- **Syawal:** 6 Syawal fasts tracker.
- **Dhul Hijjah 1–9:** first-10-days 'amal; Arafah fast (non-pilgrims); **hajj day view** for pilgrims.
- **Otherwise:** today's prayers and 'amal.

## 4. Core feature — Ramadhan Plan (journal)

The single most important feature for the primary user.

**Before Ramadhan (setup, ≤ 3 minutes):**
1. Niyyah: "This Ramadhan I want to…" (presets + own words).
2. Pick 'amal from presets, each with a **minimum**, a **cue** (after a prayer / time / before sleep) and a frequency:
   - Tilawah (target: khatam ×1 → auto-split into pages per day; or own target)
   - Tarawih / qiyam
   - Sedekah (daily / Friday)
   - Dzikir pagi-petang
   - Du'a list (personal du'a she wants to ask for)
   - Own 'amal
3. **Last 10 nights plan** — written separately: what she'll do each night (qiyam, tilawah, du'a list, sedekah).
4. Free-form **journal note** for the month.

**During Ramadhan:**
- Reminders fire from the cue; tap → mark Minimum / Extra (Istiqamah §14).
- Missed → supportive recovery flow (Istiqamah §12), never "debt".
- Weekly reflection on days 7, 14, 21, 30 (feeling 1–6, closeness to niyyah 1–6, change something?).
- Day 18–20: plan review. Nights 21–30: nightly reminder showing **her own written plan**.

## 5. Tab requirements (MVP)

### 5.1 Salat
- Prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) from GPS or chosen city; offline.
- Default calculation: **Kemenag RI** (Fajr 20°, Isha 18°), Asr Shafi'i/standard shadow; method and per-prayer minute adjustments in settings.
- Per-prayer reminder toggles; pre-reminder offset (e.g. 10 min before).
- Qibla direction (compass on native).
- Dzikir after salah reader.

### 5.2 Puasa
- Imsak (default Fajr − 10 min, editable) and iftar countdown.
- Daily fast log (fasted / not fasted + reason, private).
- Qadha tracker: count to make up, log as made up.
- Sunnah fasts calendar: Mon/Thu, Ayyamul Bidh (13–15), 6 Syawal, Arafah, Tasu'a/'Ashura — with optional reminders the evening before (sahur).
- Du'a berbuka.

### 5.3 Zakat
- **Zakat fitrah:** household members × (2.5 kg / 3.5 L rice **or** money value). The rupiah amount is entered by the user (set yearly by BAZNAS / regional authority); show the source note.
- Zakat maal: assets − debts vs. nisab (85 g gold; gold price entered by the user), 2.5%.
- Sedekah log (private, optional).
- Reminder: pay zakat fitrah before Eid prayer.

### 5.4 Haji & Umrah
- Mode toggle: Hajj / Umrah.
- Day-by-day manasik 8–13 Dhul Hijjah (Tarwiyah, Arafah, Muzdalifah, Mina/jamarat, tawaf ifadah, sa'i, tahallul, tawaf wada'), each with: what to do now, where, what's next, du'a.
- **Tawaf counter (7)** and **sa'i counter (7)**: huge tap target, vibration per round, keep-screen-on, undo.
- Jamarat counter (7 pebbles × pillar × day).
- Checklists: ihram prohibitions, packing, documents.
- **Emergency card:** name, kloter, hotel, mutawwif/leader phone, blood type — readable offline, big text.
- Content source: Kemenag *Buku Tuntunan Manasik Haji* and *Buku Doa & Dzikir* (uploaded), reviewed against the manhaj below.

## 6. Manhaj & content policy

- **Default manhaj: Salafi** (following the Qur'an and authentic Sunnah per the understanding of the salaf).
- Du'a/dzikir shown by default are those with clear evidence (hadith source shown where possible).
- Where Kemenag material includes practices not established by authentic evidence (e.g. a specific du'a per tawaf/sa'i round), show them only behind an **optional "Kemenag version" toggle**, with a short neutral note — to be confirmed by Kiki's reviewer.
- Fiqh points that differ (e.g. tarawih rakaat) are presented as user settings, not rulings.
- **All religious text must be reviewed by a qualified ustadz before release.** The app shows guidance; it does not issue rulings.

## 7. Text & reading settings

Global and per-content:
- Text size (UI) — at least 4 steps; respect OS font scaling.
- Arabic size (separate), Arabic on/off.
- Latin transliteration on/off.
- Translation on/off + language (Indonesian default; English; more later).
- Qur'an: separate settings set (Arabic size, transliteration, translation language, word-by-word later).
- "Big & simple" preset for elderly users: larger text, higher contrast, fewer elements per screen.

## 8. Data model (on-device)

```text
Settings      { locale, location, calcMethod, adjustments, imsakOffset, text{…}, manhaj, hajjMode }
Plan          { id, season: 'ramadhan-1448', niyyah, journal, last10Plan[], createdAt }
Amal          { id, planId?, name, category, minimum{value,unit}, cue{type:'afterPrayer'|'time'|'beforeSleep', prayer?, time?}, frequency, status }
AmalLog       { id, amalId, date, effort:'skipped'|'minimum'|'extra', extraValue?, note? }
Reflection    { id, planId, day, feeling(1-6), closeness(1-6), changeSomething: bool, note? }
FastLog       { date, fasted: bool, reason?, kind:'ramadhan'|'qadha'|'sunnah' }
QadhaBalance  { year, owed, madeUp }
ZakatRecord   { id, type:'fitrah'|'maal', people?, unitValue, total, paidAt? }
HajjProgress  { mode, stepId, done, counters{tawaf, sai, jamarat{…}} }
EmergencyCard { name, kloter, hotel, leaderPhone, bloodType, notes }
ScheduledReminder { id, fireAt, kind, refId, title, body }   // rolling window for the OS queue
```

## 9. Design

Extends the Istiqamah/companion DESIGN.md: dark teal ladder (`#003231` base), white text, pills for actions, 16dp cards, the yellow→green highlight stroke used sparingly, lantern effort states, floating glass bottom nav (now 5 items). Additions:
- Big & simple preset tokens (base 18sp, tap targets ≥ 56dp).
- Counter component (tawaf/sa'i) — full-width, ≥ 50 % of screen height tap area.
- Light theme: later.

## 10. Milestones

| # | Scope | Target |
|---|---|---|
| M1 | Scaffold, design tokens, five tabs, Home + Salat (times, countdown), settings, notification module | Nov 2026 |
| M2 | Ramadhan Plan + 'amal + logs + reflections; Puasa tab; Capacitor + native notifications; Xiaomi setup guide | Dec 2026 |
| M3 | Qur'an reader with text settings; du'a & dzikir library | early Jan 2027 |
| M4 | Zakat tab; last-10-nights mode; test on both phones | **mid-Jan 2027** |
| M5 | Haji & Umrah tab with reviewed content; counters; emergency card | Apr 2027 |

## 11. Out of scope (for now)
Accounts, cloud sync, social features, audio recordings (none available yet), spiritual scoring, automatic religious rulings.

## 12. Open questions
1. Reviewer sign-off on the per-round tawaf/sa'i du'a toggle approach.
2. Qur'an text & translation sources (licence): e.g. Tanzil Uthmani text + Kemenag translation.
3. Will the mother travel for Hajj 1448 (kloter, group) — affects M5 priority.
