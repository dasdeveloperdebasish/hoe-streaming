export const STRINGS = {
  // Actions
  play: "Play",
  myList: "My List",
  inList: "✓  My List",
  addList: "+  My List",
  info: "Info",
  retry: "Retry",
  fullscreen: "Fullscreen",
  browseShows: "Browse shows",

  // Section titles
  cast: "Cast",
  moreLikeThis: "More like this",
  trendingNow: "Trending now",

  // Search
  searchPlaceholder: "Search shows, movies, genres",
  searchPrompt: "Find something to watch",
  searchPromptHint: "Search by title or genre.",
  noResultsTitle: "No results",

  // Empty / error states
  homeEmptyTitle: "Nothing here yet",
  homeEmptyMessage: "No shows in this category.",
  errorTitle: "Couldn't load shows",
  errorMessage: "Check your connection and try again.",
  watchlistEmpty: "Shows you save will appear here.",

  // Profile
  myListSection: "My List",
  preferences: "Preferences",
  darkMode: "Dark mode",
  language: "Language",
  downloadQuality: "Download quality",
  inYourList: (n: number) => `${n} in your list`,

  // Player
  playerFullscreenHint: "Tap the video, then the expand icon for fullscreen",
} as const;
