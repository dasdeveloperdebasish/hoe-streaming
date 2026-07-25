## NativeWind v5 (not v4)

Expo SDK 57 ships React Native 0.82 with the new architecture.
NativeWind v4 relied on a Babel JSX transform (jsxImportSource) that
breaks there — v5 replaced it with an import rewrite system.

Design tokens live in global.css under @theme, not tailwind.config.js,
because Tailwind v4 moved theme config into CSS.

## Types design

- ContentDetail extends Content — detail screen reuses base card type, no drift.
- Sections store itemIds not full objects — single source of truth, no duplication.
- progress is optional — only Continue Watching has it; strict mode forces null checks.
