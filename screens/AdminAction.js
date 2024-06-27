import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";

const LoginScreen = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigation = useNavigation();
  // const handlePress = (url) => {
  //   Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  // };

  const handleUser = async() => {
    actionType = "User";
    navigation.navigate('CRUDPage', { actionType });
  };
  const handleForms = async() => {
    actionType = "Form";
    navigation.navigate('CRUDPage', { actionType });
  };
  const handleGroup = async() => {
    actionType = "Group";
    navigation.navigate('CRUDPage', { actionType });
  };
  const handleTournament = async() => {
    actionType = "Tournaments";
    navigation.navigate('CRUDPage', { actionType });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      {/* <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View> */}
        <TouchableOpacity style={styles.button} onPress={handleUser}>
          <Text style={styles.buttonText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleForms}>
          <Text style={styles.buttonText}>Forms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGroup}>
          <Text style={styles.buttonText}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTournament}>
          <Text style={styles.buttonText}>Tournament</Text>
        </TouchableOpacity>
    
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  logoContainer: {
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  web: {
    width: 40,
    height: 50,
    resizeMode: 'contain',
  },
  forgotPassword: {
    color: '#4B0082',
    fontWeight: 'bold',
    marginTop: 1,
    marginRight: 165,
    width: 200,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
