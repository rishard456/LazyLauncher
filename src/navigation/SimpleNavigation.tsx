import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  currentScreen: string;
  params: any;
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
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

  const navigate = (screen: string, navParams?: any) => {
    setCurrentScreen(screen);
    setParams(navParams || {});
    setHistory((prev) => [...prev, screen]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
      setParams({});
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, params, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};
