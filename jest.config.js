"use strict";

module.exports = {
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
