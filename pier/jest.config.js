/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  preset: 'ts-jest/presets/default-esm',
  collectCoverageFrom: ['src/**/*.ts'],
}
