import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
// import { HomeScreen } from '../screens/HomeScreen-simple';
// import { HomeScreen } from '../screens/HomeScreen'; // Complex version disabled
// import { AppStoreScreen } from '../screens/AppStoreScreen';
// import { QRScannerScreen } from '../screens/QRScannerScreen';
// import { AppRunnerScreen } from '../screens/AppRunnerScreen';
import { StorageService } from '../services/storage';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  useEffect(() => {
    // Initialize storage on app start
    StorageService.initialize();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
        initialRouteName="Home"
      >
        {/* TESTING: Using WelcomeScreen as Home to see if route name matters */}
        <Stack.Screen
          name="Home"
          component={WelcomeScreen}
        />
        {/* <Stack.Screen
          name="AppStore"
          component={AppStoreScreen}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScannerScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="AppRunner"
          component={AppRunnerScreen}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
