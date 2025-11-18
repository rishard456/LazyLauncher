import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

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

  // Use ref to avoid re-renders
  const focusListenersRef = useRef<Map<string, Set<() => void>>>(new Map());

  const navigate = (screen: string, navParams?: any) => {
    setCurrentScreen(screen);
    setParams(navParams || {});
    setHistory((prev) => [...prev, screen]);

    // Trigger focus listeners for the new screen
    setTimeout(() => {
      const listeners = focusListenersRef.current.get(screen);
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
        const listeners = focusListenersRef.current.get(previousScreen);
        if (listeners) {
          listeners.forEach(callback => callback());
        }
      }, 0);
    }
  };

  const addListener = (event: string, callback: () => void) => {
    if (event === 'focus') {
      // Get or create listeners set for current screen
      if (!focusListenersRef.current.has(currentScreen)) {
        focusListenersRef.current.set(currentScreen, new Set());
      }
      const screenListeners = focusListenersRef.current.get(currentScreen)!;
      screenListeners.add(callback);

      // Return unsubscribe function
      return () => {
        const listeners = focusListenersRef.current.get(currentScreen);
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
