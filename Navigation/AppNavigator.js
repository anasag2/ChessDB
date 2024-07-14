import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, StyleSheet, Platform, Modal, View, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import VerifyUserScreen from '../screens/VerifyUserScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import FormGenerator from '../screens/FormGenerator';
import TabNavigator from './TabNavigator';
import ActionsTabNavigator from './ActionsTabNavigator';
import FormBuilderScreen from '../screens/FormBuilderScreen';
import CustomHeader from './CustomHeader';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
      
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            height: 80, // Adjust based on your needs
            backgroundColor: '#fff', // Optional: Set background color
          },
          headerRight: () => (
            <TouchableOpacity onPress={toggleMenu} style={{ marginRight: 15 }}>
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
          options={({ navigation }) => ({
            headerRight: () => <CustomHeader navigation={navigation} />,
            headerTitle: ' ',
            headerLeft: () => null,
          })}
        />
        <Stack.Screen name="CRUDPage" component={ActionsTabNavigator} options={{ headerShown: true,  headerTitle: '' }} />
        <Stack.Screen name="Verify" component={VerifyUserScreen} options={{ headerShown: true,  headerTitle: '' }} />
        <Stack.Screen name="ResetPassword" component={PasswordResetScreen} options={{ headerShown: true,  headerTitle: ''}} />
        <Stack.Screen name="FormGenerator" component={FormGenerator} options={{ headerShown: true,  headerTitle: ''}} />
        <Stack.Screen name="Form" component={FormBuilderScreen} options={{ headerShown: true,  headerTitle: '' }} />
        </Stack.Navigator>
        <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
              toggleMenu();
            }}>
            <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
