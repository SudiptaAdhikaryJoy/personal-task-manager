import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { TextDecoder, TextEncoder } from 'util'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      query: {},
    }
  },
}))

// Mock IntersectionObserver
// Mock IntersectionObserver more robustly
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback: Function) {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };
  
// Add TextEncoder/TextDecoder to global
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks()
})

