export const STORAGE_KEYS = {
  INSTALLED_APPS: '@lazylauncher:installed_apps',
  APP_DATA_PREFIX: '@lazylauncher:app_data:',
  SETTINGS: '@lazylauncher:settings',
};

export const APP_STORE_URL = 'https://raw.githubusercontent.com/expo/expo/main/apps/';

// Mock app store data - you can replace this with a real API
export const MOCK_APP_STORE_APPS = [
  {
    id: 'demo-app-1',
    name: 'Weather App',
    description: 'Beautiful weather forecast app with real-time updates',
    icon: '🌤️',
    version: '1.0.0',
    author: 'LazyDev',
    bundleUrl: 'https://expo.dev/@demo/weather-app',
    isInstalled: false,
  },
  {
    id: 'demo-app-2',
    name: 'Todo List',
    description: 'Simple and elegant todo list manager',
    icon: '✅',
    version: '1.2.0',
    author: 'LazyDev',
    bundleUrl: 'https://expo.dev/@demo/todo-app',
    isInstalled: false,
  },
  {
    id: 'demo-app-3',
    name: 'Calculator',
    description: 'Advanced calculator with scientific functions',
    icon: '🔢',
    version: '2.0.0',
    author: 'LazyDev',
    bundleUrl: 'https://expo.dev/@demo/calculator',
    isInstalled: false,
  },
  {
    id: 'demo-app-4',
    name: 'Music Player',
    description: 'Stream and play your favorite music',
    icon: '🎵',
    version: '1.5.0',
    author: 'LazyDev',
    bundleUrl: 'https://expo.dev/@demo/music-player',
    isInstalled: false,
  },
];

export const FLOATING_BUTTON_SIZE = 56;
export const FLOATING_BUTTON_MARGIN = 16;
