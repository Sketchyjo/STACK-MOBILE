/**
 * Test setup file for UI Library
 * Configures React Testing Library and Jest environment for React Native Web
 */

import '@testing-library/jest-dom';

// Mock React Native modules for web environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native-web');
  
  return {
    ...RN,
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
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
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

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native-web');
  
  const createMockComponent = (name: string) => {
    const MockComponent = (props: any) => {
      return React.createElement(Text, {
        ...props,
        'data-testid': props.testID || `${name}-icon`,
        children: props.name || '📱',
      });
    };
    MockComponent.displayName = name;
    return MockComponent;
  };

  return {
    Ionicons: createMockComponent('Ionicons'),
    MaterialIcons: createMockComponent('MaterialIcons'),
    FontAwesome: createMockComponent('FontAwesome'),
    AntDesign: createMockComponent('AntDesign'),
    Entypo: createMockComponent('Entypo'),
    EvilIcons: createMockComponent('EvilIcons'),
    Feather: createMockComponent('Feather'),
    FontAwesome5: createMockComponent('FontAwesome5'),
    Foundation: createMockComponent('Foundation'),
    MaterialCommunityIcons: createMockComponent('MaterialCommunityIcons'),
    Octicons: createMockComponent('Octicons'),
    SimpleLineIcons: createMockComponent('SimpleLineIcons'),
    Zocial: createMockComponent('Zocial'),
  };
});

// Global test utilities - suppress console.warn in tests unless explicitly needed
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Only show warnings that contain 'Warning:' (React warnings)
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning:')) {
    originalWarn(...args);
  }
};