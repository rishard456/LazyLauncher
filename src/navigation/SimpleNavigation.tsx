import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface NavigationContextType {
  currentScreen: string;
  params: any;
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  addListener: (event: string, callback: () => void) => () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  initialScreen: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialScreen,
}) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [params, setParams] = useState<any>({});
  const [history, setHistory] = useState<string[]>([initialScreen]);
  const [focusListeners, setFocusListeners] = useState<Map<string, Set<() => void>>>(new Map());

  const navigate = (screen: string, navParams?: any) => {
    const previousScreen = currentScreen;
    setCurrentScreen(screen);
    setParams(navParams || {});
    setHistory((prev) => [...prev, screen]);

    // Trigger focus listeners for the new screen
    setTimeout(() => {
      const listeners = focusListeners.get(screen);
      if (listeners) {
        listeners.forEach(callback => callback());
      }
    }, 0);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setParams({});

      // Trigger focus listeners for the previous screen
      setTimeout(() => {
        const listeners = focusListeners.get(previousScreen);
        if (listeners) {
          listeners.forEach(callback => callback());
        }
      }, 0);
    }
  };

  const addListener = (event: string, callback: () => void) => {
    if (event === 'focus') {
      const screenListeners = focusListeners.get(currentScreen) || new Set();
      screenListeners.add(callback);
      setFocusListeners(new Map(focusListeners).set(currentScreen, screenListeners));

      // Return unsubscribe function
      return () => {
        const listeners = focusListeners.get(currentScreen);
        if (listeners) {
          listeners.delete(callback);
        }
      };
    }
    // Return no-op unsubscribe for other events
    return () => {};
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, params, navigate, goBack, addListener }}>
      {children}
    </NavigationContext.Provider>
  );
};
