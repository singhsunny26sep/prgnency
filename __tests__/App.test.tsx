/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import {it} from '@jest/globals';

import renderer from 'react-test-renderer';

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({}),
  useRoute: () => ({}),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-video', () => 'Video');

jest.mock('@notifee/react-native', () => ({}));

jest.mock('../localization', () => ({
  setLanguage: jest.fn(),
  getLanguage: jest.fn(() => 'en'),
}));

jest.mock('../src/services/NotificationService', () => ({
  __esModule: true,
  default: {
    requestUserPermission: jest.fn(() => Promise.resolve()),
    createNotificationChannel: jest.fn(() => Promise.resolve()),
    setupNotificationListeners: jest.fn(),
  },
}));

jest.mock('../src/Screens/SplashScreen', () => 'SplashScreen');

it('renders correctly', () => {
  renderer.create(<App />);
});