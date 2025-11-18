import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
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
