import React from 'react';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

export default function App() {
  // NO NAVIGATION - Direct component render
  return <WelcomeScreen navigation={null} />;
}
