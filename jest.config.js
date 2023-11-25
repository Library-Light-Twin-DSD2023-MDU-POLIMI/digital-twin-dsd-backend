module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Make sure this line is included
    },
    // If you have additional Jest configurations, they go here
  };
  