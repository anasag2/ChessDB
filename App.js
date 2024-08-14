import React from 'react';
import AppNavigator from './Navigation/AppNavigator';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';




export default function App() {
  LogBox.ignoreAllLogs();
  return <AppNavigator />;
}
