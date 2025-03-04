import type { Config } from 'jest';

const config: Config = {
  // Specify the test environment for browser-like testing
  testEnvironment: 'jsdom',
  
  // Setup files to run before tests
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
  
  // Module name mapper for handling imports and static assets
  moduleNameMapper: {
    // Handle CSS and other static imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle module aliases if you're using them
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transform files to be compatible with Jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // Match test files
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '**/?(*.)+(spec|test).+(js|jsx|ts|tsx)'
  ],
  
  // File extensions to consider
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // Collect coverage information
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Ignore specific paths for coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/src/types/'
  ],
  
  // Verbose output for better debugging
  verbose: true,
  
  // Stop running tests after a certain number of failures
  bail: 1,
  
  // Clear mocks between test runs
  clearMocks: true
};

export default config;