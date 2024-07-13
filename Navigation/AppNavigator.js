import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import VerifyUserScreen from '../screens/VerifyUserScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import FormGenerator from '../screens/FormGenerator';
import TabNavigator from './TabNavigator';
import ActionsTabNavigator from './ActionsTabNavigator';
import FormBuilderScreen from '../screens/FormBuilderScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            height: 80, // Adjust based on your needs
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log('Menu pressed')} style={{ marginRight: 15 }}>
              <Image
                source={require('../assets/burger-bar.png')}  // Ensure the path is correct
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          )
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="HomePage" 
          component={TabNavigator} 
          options={({ navigation, route }) => ({
            headerShown: true,
            headerTitle: '',
            headerRight: () => (
              <TouchableOpacity onPress={() => console.log('Menu pressed')} style={{ marginRight: 15 }}>
                <Image
                  source={require('../assets/burger-bar.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
            headerLeft: () => null  // Ensures no duplicate icons
          })}
        />
        <Stack.Screen name="CRUDPage" component={ActionsTabNavigator} options={{ headerShown: true,  headerTitle: '' }} />
        <Stack.Screen name="Verify" component={VerifyUserScreen} options={{ headerShown: true,  headerTitle: '' }} />
        <Stack.Screen name="ResetPassword" component={PasswordResetScreen} options={{ headerShown: true,  headerTitle: ''}} />
        <Stack.Screen name="FormGenerator" component={FormGenerator} options={{ headerShown: true,  headerTitle: ''}} />
        <Stack.Screen name="Form" component={FormBuilderScreen} options={{ headerShown: true,  headerTitle: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
