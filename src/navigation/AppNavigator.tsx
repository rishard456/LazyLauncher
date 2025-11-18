import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AppStoreScreen } from '../screens/AppStoreScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { AppRunnerScreen } from '../screens/AppRunnerScreen';
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
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="AppStore"
          component={AppStoreScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScannerScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="AppRunner"
          component={AppRunnerScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
