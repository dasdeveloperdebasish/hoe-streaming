jest.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "dark", setColorScheme: jest.fn() }),
  cssInterop: jest.fn(),
}));
