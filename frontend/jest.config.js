module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/redux/slices/**/*.js"],
  coverageReporters: ["text", "lcov"]
};
