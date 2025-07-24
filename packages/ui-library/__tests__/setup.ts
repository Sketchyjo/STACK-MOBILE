/**
 * Test setup file for UI Library
 * Configures React Native Testing Library and Jest environment
 */

import '@testing-library/jest-native/extend-expect';

// Mock React Native modules for web environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native-web');
  const React = require('react');
  
  // Mock Modal component
  const MockModal = ({ children, visible, ...props }: any) => {
    return visible ? React.createElement('div', { 'data-testid': 'modal', role: 'dialog', ...props }, children) : null;
  };
  
  // Add missing React Native specific components/modules
  return {
    ...RN,
    Modal: MockModal,
    NativeModules: {
      StatusBarManager: {
        HEIGHT: 20,
        getHeight: (cb: (result: { height: number }) => void) => cb({ height: 20 }),
      },
    },
    Platform: {
      OS: 'web',
      select: (obj: any) => obj.web || obj.default,
    },
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      Value: jest.fn(() => ({
        interpolate: jest.fn(() => 0),
      })),
    },
  };
});

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (Component: any) => Component,
  useColorScheme: () => ({ colorScheme: 'light' }),
}));

// Mock Expo modules if they exist
jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
  },
}));

// Global test utilities - suppress console.warn in tests unless explicitly needed
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Only show warnings that contain 'Warning:' (React warnings)
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning:')) {
    originalWarn(...args);
  }
};