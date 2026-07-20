import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '!app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!components/ui/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.test.{ts,tsx}',
    '!features/**/*.repository.ts',
    '!app/**/{page,layout,loading,error,not-found,template}.tsx',
    '!app/**/route.ts',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ou setupFilesAfterEach selon version
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

export default createJestConfig(config);
