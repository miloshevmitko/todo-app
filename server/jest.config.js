/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  moduleNameMapper: {
    "^@todo-app/server/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: ["src/**/*"],
  coveragePathIgnorePatterns: [
    "index.ts",
    "router.ts",
    "types.ts",
    "src/configs",
    "src/typings",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
