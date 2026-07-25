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

## Skeleton / animation choice

- Started with react-native-reanimated but it needs extra config on Expo SDK 57
  (RN 0.82 new architecture). Rather than fight it near deadline, used RN's
  built-in Animated API with useNativeDriver:true — runs on native thread,
  same 60fps shimmer, zero extra dependency risk.
- Lesson: pick the simplest tool that meets the bar. Reanimated earns its place
  for gesture-driven work; a pulsing opacity does not need it.

  ## Detail screen

- Scroll-driven animated header: Animated.Value tracks scrollY (useNativeDriver),
  interpolated to scale the image on pull-down and fade it on scroll-up. Native
  thread = 60fps. RN built-in Animated, no Reanimated needed.
- navigation.push (not navigate) for "more like this" so A->B->C drilldown works
  and back pops one at a time.
- Cast = plain row (3 fixed items, no virtualization). Related = FlatList Carousel
  (variable length). Right tool per list.
- Reuses Carousel, SectionTitle, skeleton/error components from Home. DRY.

  ## Profile + Zustand

- Two Zustand stores: theme (mode + toggle) and watchlist (ids + toggle + has).
- Each store is ~10 lines, no provider/slice/reducer. This is the Redux-vs-Zustand
  argument: two pieces of client state don't justify Redux boilerplate.
- SettingsRow is one reusable component for both switch rows and value rows.
- Watchlist count on profile is live — proves cross-screen Zustand state.

## Search

- Reuses React Query + service layer + hook pattern — near-zero new plumbing.
  Payoff of the layered architecture.
- Three states: empty query prompt, no-results empty state, results list.
- searchContent has no random failure + shorter delay (search must feel snappy).
- TODO: debounce query in production to avoid a request per keystroke.
- keyboardShouldPersistTaps so tapping a result works with keyboard open.
