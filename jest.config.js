module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTestsAfterEnv.js'],
  testMatch: ['<rootDir>/react/**/*.test.{ts,tsx,js,jsx}'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleNameMapper: {
    '\\.(css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?.*)?$':
      'identity-obj-proxy',
  },
  transform: {
    '\\.[jt]sx?$': '<rootDir>/jest.transform.js',
  },
}
