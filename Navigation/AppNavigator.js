import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import VerifyUserScreen from '../screens/VerifyUserScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import FormGenerator from '../screens/FormGenerator';
import TabNavigator from './TabNavigator';
import ActionsTabNavigator from './ActionsTabNavigator'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="CRUDPage" component={ActionsTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Verify" component={VerifyUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={PasswordResetScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FormGenerator" component={FormGenerator} options={{ headerShown: false }} />
      </Stack.Navigator>
      
      
        
      
    </NavigationContainer>
  );
};


export default AppNavigator;
