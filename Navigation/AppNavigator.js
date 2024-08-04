import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {  StyleSheet } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import VerifyUserScreen from '../screens/VerifyUserScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import FormGenerator from '../screens/FormGenerator';
import TabNavigator from './TabNavigator';
import ActionsTabNavigator from './ActionsTabNavigator';
import FormBuilderScreen from '../screens/FormBuilderScreen';
import CustomHeader from '../components/BurgerMenu';
import CreateGroupScreen from '../screens/CreateGroupsScreen';
// import { LogBox } from 'react-native';
const Stack = createStackNavigator();

const AppNavigator = () => {
  // LogBox.ignoreAllLogs();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: { height: 80, backgroundColor: '#fff' },
          headerTitle: ' ',
          headerRight: () => <CustomHeader navigation={navigation} toggleMenu={toggleMenu} />,
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={TabNavigator} options={{ headerLeft: null }} />
        <Stack.Screen 
          name="CRUDPage" 
          component={ActionsTabNavigator} 
          options={({ navigation }) => ({
            headerRight: () => <CustomHeader navigation={navigation} toggleMenu={toggleMenu} />,
          })}
        />
        <Stack.Screen 
          name="Verify" 
          component={VerifyUserScreen} 
          options={({ navigation }) => ({
            headerRight: () => null ,
          })}
        />
        <Stack.Screen name="ResetPassword" component={PasswordResetScreen} options={{ headerRight: () => null }} />
        <Stack.Screen 
          name="FormGenerator" 
          component={FormGenerator} 
          options={({ navigation }) => ({
            headerRight: () => <CustomHeader navigation={navigation} toggleMenu={toggleMenu} />,
          })}
        />
        <Stack.Screen 
          name="Form" 
          component={FormBuilderScreen} 
          options={({ navigation }) => ({
            headerRight: () => <CustomHeader navigation={navigation} toggleMenu={toggleMenu} />,
          })}
        />
        <Stack.Screen name='AdminHomeScreen' component={CreateGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  logoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonText: {
    color: "white"
  }
});

export default AppNavigator;
