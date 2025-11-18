import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation } from './SimpleNavigation';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AppStoreScreen } from '../screens/AppStoreScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { AppRunnerScreen } from '../screens/AppRunnerScreen';
import { StorageService } from '../services/storage';

function NavigationRouter() {
  const navigation = useNavigation();

  useEffect(() => {
    StorageService.initialize();
  }, []);

  const renderScreen = () => {
    switch (navigation.currentScreen) {
      case 'Welcome':
        return <WelcomeScreen navigation={navigation} />;
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'AppStore':
        return <AppStoreScreen navigation={navigation} />;
      case 'QRScanner':
        return <QRScannerScreen navigation={navigation} />;
      case 'AppRunner':
        return <AppRunnerScreen navigation={navigation} route={{ params: navigation.params }} />;
      default:
        return <WelcomeScreen navigation={navigation} />;
    }
  };

  return <>{renderScreen()}</>;
}

export function AppNavigator() {
  return (
    <NavigationProvider initialScreen="Home">
      <NavigationRouter />
    </NavigationProvider>
  );
}
