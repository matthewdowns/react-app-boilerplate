const tsconfig = require('./tsconfig.json');
const tsconfigPathsJest = require('tsconfig-paths-jest');

const moduleNameMapper = tsconfigPathsJest(tsconfig);

module.exports = {
  moduleNameMapper,
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
  setupFilesAfterEnv: [
      '<rootDir>/jest.setup.ts'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};