import React from 'react';
import AppNavigator from './Navigation/AppNavigator';
import { LogBox } from 'react-native';




export default function App() {
  LogBox.ignoreAllLogs();
  return <AppNavigator />;
}
