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

## React Query + hooks

- QueryClientProvider wraps the app; every screen gets caching/loading/error free.
- queryKey ["content", id] caches each show separately — revisiting is instant.
- Screens call hooks (useHomeFeed), hooks call services (api.ts). 3 layers.
- retry:1 + 8% mock failure = error state reachable but not annoying.
- enabled guard stops queries firing on empty input.

## Navigation

- Typed param lists (HomeStackParamList) — navigate() calls are type-checked.
- Home tab contains a stack, not a bare screen, so Detail pushes over the tab
  and the tab bar stays visible (Netflix/Hotstar pattern).
- headerShown:false on Detail — it gets a custom animated header later.
- Provider order: QueryClient > SafeArea > NavigationContainer > tabs.
