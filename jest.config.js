/* eslint-env node */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Make sure this line is included
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'], // update this line
  // If you have additional Jest configurations, they go here
};
