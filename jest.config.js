module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  setupFiles: ['<rootDir>/tests/setup.js'],
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests/fixtures'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  moduleNameMapper: {
    '^@/middlewares(|/.*)$': '<rootDir>/src/api/middlewares$1',
    '^@/validations(|/.*)$': '<rootDir>/src/api/validators$1',
    '^@/api(|/.*)$': '<rootDir>/src/api$1',
    '^@/config(|/.*)$': '<rootDir>/src/config$1',
    '^@/models(|/.*)$': '<rootDir>/src/models$1',
    '^@/services(|/.*)$': '<rootDir>/src/services$1',
    '^@/utils(|/.*)$': '<rootDir>/src/utils$1',
    '^@(|/.*)$': '<rootDir>/src$1',
  },
  testTimeout: 30000,
};
