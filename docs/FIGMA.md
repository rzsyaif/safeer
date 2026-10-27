# Figma ↔ code map

Design file: https://www.figma.com/design/GKIBecYwZs11Q6RtVtsM0b/Safeer--Design-System

| Figma page | What it holds | Code |
|---|---|---|
| Cover | Overview + example Beranda | — |
| Screens | 01 Beranda · 02 Salat · 03 Puasa · 04 Zakat · 05 Haji · 06 Pengaturan | `src/screens/*.tsx` (routes `/`, `/salat`, `/puasa`, `/zakat`, `/haji`, `/pengaturan`) |
| Foundations | Variables (Color, Spacing, Radius, Size — modes Default / Big & Simple) and text styles | `src/styles/tokens.css` (each variable's WEB code syntax = its CSS var) |
| Icons | 12 stroke icons | `src/components/BottomNav.tsx` and inline SVGs |
| Components | Button, Icon Button, Chip, Banner, Switch, Switch Row, Segment/Segmented, Slider Field, Input Field, Stepper, Lantern, Empty State, Nav Item, Bottom Nav, Prayer Row, Card, Prayer Card, Dua Card, Tawaf Counter | `src/styles/app.css` classes + `src/components/*` |

Workflow: edit in Figma → ask Claude to sync → Claude reads the changed frames and updates tokens/components/screens in code.
