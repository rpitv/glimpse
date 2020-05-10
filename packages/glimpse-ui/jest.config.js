module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '\\.css$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  'testURL': 'http://localhost/',
  'testRegex': '(/__tests__/.*|/test/.*/(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  'coverageDirectory': './coverage/',
  'collectCoverage': true,
  'collectCoverageFrom': [
    '<rootDir>/components/**/*.vue'
  ],
  'setupFilesAfterEnv': [
    '<rootDir>/test-init.js'
  ],
  snapshotSerializers: [
    'jest-serializer-vue'
  ]
}
