module.exports = {
  setupFilesAfterEnv: ['./rtl.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts*',
    '!node_modules/',
    '!src/**/*.stories.ts',
    '!src/themes/**',
    '!src/icons/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.ts',
  },
};
