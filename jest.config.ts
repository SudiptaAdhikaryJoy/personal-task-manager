import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: [
      '<rootDir>/.next/',
      '<rootDir>/node_modules/',
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Ensure this matches your tsconfig or jsconfig paths
      '^@/_store/(.*)$': '<rootDir>/src/_store/$1', // Assuming you need to map more paths like this one.
    },
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.stories.{js,jsx,ts,tsx}',
      '!src/**/*.test.{js,jsx,ts,tsx}',
      '!src/**/index.{js,jsx,ts,tsx}',
    ],
    moduleDirectories: ['node_modules', '<rootDir>/'],
  }
  

  
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)