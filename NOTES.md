# Developer Notes

These are my design decisions and the reasoning behind them, written plainly.
This is my own reference for the follow-up interview — one entry per decision,
explaining _why_ I did it that way, not just _what_ I did.

---

## The stack, and why

- **Expo SDK 57** (latest) — runs React Native 0.86 on the New Architecture.
- **TypeScript strict** — catches bugs before the app runs.
- **NativeWind v5** — Tailwind classes for styling.
- **React Navigation** — bottom tabs + native stacks.
- **React Query** — handles all server-style data (loading, error, caching).
- **Zustand** — small global client state (theme, watchlist).
- **React Native Paper** — the required component library (form controls).
- **expo-video, expo-image, expo-linear-gradient** — media and images.

I chose Disney+ Hotstar as the reference: a media/streaming app. My mock content
maps cleanly to it (carousels = categories, detail = a show page).

---

## NativeWind v5, not v4 (a config battle I lost then won)

Expo SDK 57 ships React Native 0.86 on the New Architecture. NativeWind v4 used a
Babel JSX transform (`jsxImportSource`) that breaks on the New Architecture — it
crashed Metro with a `transformFile` error. v5 replaced that transform with an
import-rewrite system, so it works.

Because I moved to Tailwind v4 (which v5 needs), the design tokens (my colours)
live in `global.css` under `@theme`, not in `tailwind.config.js`. Tailwind v4
moved theme config into CSS.

**Lesson:** on the newest SDK, libraries often need their newest versions. Being
current is good, but it means reading release notes.

---

## Design tokens live in two synced places

- `global.css` `@theme` — powers `className` styling (`bg-bg`, `text-ink`).
- `src/constants/theme.ts` `COLORS` — powers inline `style={}` and JS values
  (tab bar tint, gradient colours, Paper theme).

Same hex values in both. NativeWind can't feed Tailwind tokens into inline styles,
so I keep one JS copy. One place to change a colour; the whole app follows.

---

## Types design

- `ContentDetail extends Content` — the detail screen reuses the base card type
  and just adds cast + related. No two types drifting apart.
- Sections store `itemIds`, not full objects — the shows live in **one** lookup
  table (`CONTENT`), and sections point to them by id. If a show appears in three
  rows, there's still one copy. Change the title once, everywhere updates. Same
  idea as a database: one table holds data, others reference it by id.
- `progress?` is optional — only "Continue Watching" has it. Strict mode forces me
  to handle the missing case.

---

## The mock API / service layer (the "backend")

`src/services/api.ts` is the data seam.

- Every function returns a `Promise`, exactly like a real `fetch`. Screens
  `await` it and never know the data is mocked.
- Artificial ~900ms delay so the skeleton loaders are actually visible. Without a
  delay, mock data returns instantly and you'd never see a loading state.
- ~8% random failure rate so the error screen is genuinely reachable in a run,
  not dead UI. Search is excluded (search failing randomly is bad UX).
- Swapping to a real REST API later means editing only this one file. Screens and
  hooks stay untouched. That's the whole point of the layer.

---

## Three-layer data flow: screen -> hook -> service

Screens never call `api.ts` directly. They call hooks (`useHomeFeed`,
`useContentDetail`, `useSearch`), and the hooks call the service.

- The screen only renders. It says "give me the feed" and doesn't care how.
- The hook owns fetching, caching, and error state (via React Query).
- The service owns the data source.

Each layer can change without breaking the others. This is the separation of
concerns the assignment asks for, and it's why Search was almost free to build —
it reused the exact same pipeline.

---

## React Query

- `QueryClientProvider` wraps the app, so every screen gets caching, loading,
  error, and retry for free.
- `queryKey: ["content", id]` caches each show separately — open a show, go back,
  open it again = instant from cache, no second fetch.
- `retry: 1` — one silent retry before showing the error state.
- `enabled` guard — a query won't fire on empty input (e.g. related content with
  no ids, or an empty search box).

---

## Why Zustand, not Redux

The only truly global _client_ state in this app is the theme and the watchlist —
two small things. Everything else (shows, categories, details) is _server_ data,
which is React Query's job, not Redux's.

Each Zustand store is about 10 lines: no provider, no slices, no reducers. Redux
Toolkit would have added a store, slices, and a `<Provider>` to manage two
booleans. Also, the JD lists Zustand in their stack, so I matched it.

Two stores:

- `useThemeStore` — `mode` + `toggle`.
- `useWatchlistStore` — `ids` + `toggle` + `has`.

The watchlist proves cross-screen state: the "My List" button on Detail and Hero
toggles it, and the Profile shows the saved shows and a live count — no prop
drilling, all reading the same store.

---

## Navigation (and a gotcha I hit)

- Typed param lists (`HomeStackParamList`) — every `navigate()` call is
  type-checked. Pass a wrong param and it won't compile.
- Each tab that can reach the Detail screen has its **own stack**: HomeStack,
  SearchStack, ProfileStack. So Detail pushes _over_ the current tab and the tab
  bar stays visible (the Netflix/Hotstar pattern).
- **The gotcha:** Detail is reachable from Home, Search, and Profile. Every screen
  Detail can push to (Player, WebContent) must be registered in _all three_
  stacks, or the push fails in that flow. I hit this exactly — playing from a
  search result threw "no navigator handled Player" because Player was only in
  HomeStack. Fixed by registering Player + WebContent in every stack.
- `navigation.push` (not `navigate`) for "More like this" so A -> B -> C drilldown
  works and Back pops one at a time.

---

## Home screen

- The whole screen is **one vertical FlatList**. The hero + category chips are its
  `ListHeaderComponent`; each content row is a horizontal `Carousel`. That's the
  "unified scroll" the assignment wants — not a ScrollView stuffed with lists
  (which loads everything at once and janks).
- Category chips **filter** the sections by genre (case-insensitive). "All" shows
  everything. Empty rows are hidden, and if a category has no shows, an empty
  state shows instead of a blank screen.
- Pull-to-refresh via `RefreshControl`, wired to React Query's `refetch`, tinted
  coral.

---

## Detail screen

- Scroll-driven animated header: an `Animated.Value` tracks scroll position
  (`useNativeDriver: true`, so it runs on the native thread at 60fps). It fades
  the hero image as you scroll. Built with RN's built-in `Animated` — no
  Reanimated needed.
- Overscroll bounce is turned off (`bounces={false}`, `overScrollMode="never"`)
  because the stretched header collided with the body content on pull-down. A
  clean, predictable scroll beats a fancy one that misbehaves.
- Cast is a plain row (3 fixed items — no need to virtualize). "More like this" is
  a FlatList Carousel (variable length). Right tool per list.
- Reuses Carousel, SectionTitle, and the skeleton/error components from Home. DRY.

---

## Skeleton / animation choice

I started with `react-native-reanimated` for the shimmer, but it needs extra
config on SDK 57's New Architecture and kept crashing. Rather than fight it near
the deadline, I used RN's built-in `Animated` API with `useNativeDriver: true` —
runs on the native thread, same 60fps pulse, zero extra dependency risk.

**Lesson:** pick the simplest tool that clears the bar. Reanimated earns its place
for gesture-driven work; a pulsing opacity does not need it. Knowing when _not_ to
reach for the heavy tool is a real decision.

---

## Search

- Reuses the whole data pipeline (React Query + service + hook) — almost no new
  plumbing. The payoff of building the layers right.
- Three states in one screen: empty-query prompt, no-results empty state, and the
  results list.
- **Infinite scroll** is real pagination: `searchContent(query, page)` returns
  `{ items, nextPage }`, and `useInfiniteQuery` manages the cursor.
  `onEndReached` fetches the next page, with a footer spinner while it loads. Not
  a fake slice — genuine paging.
- `keyboardShouldPersistTaps="handled"` so tapping a result works with the
  keyboard open.
- **In production I'd debounce** the query so it doesn't fire on every keystroke.
  With instant mock data it's fine as-is.

---

## Video player (expo-video)

- Each show carries its own `videoUrl` in the content model. The Play button
  passes that URL via route params to a dedicated Player screen — fully
  data-driven, so different shows play different videos.
- `useVideoPlayer` binds the player to that URL; `nativeControls` uses the OS's
  own player UI (scrub, fullscreen, AirPlay, PiP) rather than a custom one.
- A "Fullscreen" button (React Native Paper's Button) calls
  `videoRef.current.enterFullscreen()`, and `expo-screen-orientation` unlocks
  landscape on this screen and restores portrait on exit.
- Sample videos are public 1080p test MP4s standing in for real signed HLS
  streams. (My first URLs were Google's old sample bucket, which now returns
  AccessDenied — I switched to a live host.)

---

## WebView (a JD-specific extra, not in the assignment)

The role emphasises WebView work, so I added it deliberately even though the
assignment didn't ask.

- `react-native-webview` with a two-way `postMessage` bridge.
- `injectedJavaScript` runs inside the page: it reports the page title (which
  updates my native header) and intercepts link taps (where a production app would
  hand off to a native route).
- Demonstrates safe JS injection, the postMessage bridge, and the native-handoff
  pattern — all things the JD lists. In production this would carry auth tokens;
  here a Wikipedia page stands in.

---

## Loading, error, and empty states

Every data screen handles all three:

- **Skeleton** while loading (grey shimmer shaped like the content — not a
  spinner, which reads as cheaper).
- **Error** with a Retry button, wired to React Query's `refetch`. Reachable
  because the mock API fails ~8% of the time.
- **Empty** for no search results, no watchlist items, and empty categories.

I verified the error state by temporarily forcing the mock failure rate to 100%.

---

## Performance

- FlatLists tuned with `initialNumToRender`, `windowSize`, `removeClippedSubviews`,
  and proper `keyExtractor`.
- Card components (`Poster`, `Chip`) are wrapped in `React.memo`; the carousel's
  `renderItem` and `keyExtractor` are `useCallback`'d so the memo actually works
  (a fresh function each render would defeat it).
- `useMemo` builds the filtered section list only when the data or category
  changes.
- Images use `expo-image` with a blurhash placeholder and fade transition — the
  "image management" the assignment names.

---

## React Native Paper (the required component library)

The assignment mandates one of Tamagui / Gluestack / Paper. I used **Paper** for
standard form controls:

- the Dark-mode **Switch** on Profile,
- the **Button** for fullscreen on the Player.

I themed Paper's `MD3DarkTheme` to my own tokens (accent, bg, surface) so the
Material components match the dark streaming look instead of looking generic.

I deliberately kept my **custom NativeWind components** (Poster, Chip, Carousel,
Tag, HeroBanner) for the streaming-specific UI, where a distinct visual identity
matters more than a library default. The split is the point: Paper for standard
controls, custom for domain UI.

---

## Centralized UI strings

All screen-level UI text lives in `src/constants/strings.ts`, not hardcoded in
components — per the assignment's "no hardcoded UI text in screens" rule. It's the
same separation-of-concerns idea as the service layer: screens arrange UI, content
lives separately. One place to change copy, and it's the first step toward
localization (swap the file for a `t()` function later). Data strings (titles,
genres) stay in the data layer; only UI chrome is centralized.

---

## Theme toggle (scoped honestly)

The Dark-mode toggle is wired: Zustand holds the mode, and `App.tsx` pushes it
into NativeWind's `setColorScheme`, which flips the status bar. The app is
**dark-first by design** to match the streaming aesthetic, so I did not build a
full light palette — that's a documented next step. I'd rather ship a polished
dark experience than a rushed second theme that looks worse.

---

## Bonuses completed

- Micro-interactions: animated detail header, shimmer skeletons.
- Pull-to-refresh (Home) and infinite-scroll pagination (Search).
- Theme toggle wired to the color-scheme system (dark-first, light is a next step).

Not done: Jest tests (optional bonus) — skipped to keep the core polished within
the deadline.

---

## Git discipline

Small, frequent commits with clear messages (feat/fix/chore/refactor/docs), spread
across the build — not one giant "initial commit." The history reads as a story:
setup, data layer, navigation, then each screen, then polish and fixes.

---

## What I'd do next with more time

- Full light theme across all screens (tokens are already centralized, so this is
  wiring `dark:` variants, not a rewrite).
- Debounce the search query.
- Real content via TMDB (keeping the mock service as a documented fallback).
- Jest + React Native Testing Library component tests.
- `expo-notifications` with deep links into Detail (the JD lists this).
