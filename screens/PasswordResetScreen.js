import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import { writeBatch, doc } from "firebase/firestore";
import { useRoute } from '@react-navigation/native'; 

const PasswordResetScreen = () => {
  const route = useRoute();
  const user = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, confirmNewPassword] = useState('');
  const navigation = useNavigation();
  
  const validatePassword = ()=>{
    if(newPasswordConfirmation.length < 8){
      alert("password is too short");
      return false;
    };
    let count = 0;
    for (let i = 0; i < newPasswordConfirmation.length; i++) {
      if(newPasswordConfirmation[i] > 47 || newPasswordConfirmation[i] < 58){
        count += 1;
      };
    };
    if(count < 3){
      alert("your password should have at least 3 numbers");
      return false;
    }
    return true;
  }

  const handleReset = async() => {
    if(newPassword != newPasswordConfirmation){
      alert("passwords are not the same");
    }
    else{
      if(newPasswordConfirmation != user["userData"]["password"]){
        if(validatePassword() == true){
          const batch = writeBatch(db);
          const userRef = doc(db, "users", user["userID"]);
          batch.update(userRef, {"password": newPasswordConfirmation});
          navigation.navigate('Login');
          await batch.commit();
        }
      }
      else{
        alert("you cant put previous old password as new one");
      };
    };
  };
  
  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
        <TextInput
          style={styles.input}
          placeholder="new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="confirm new password"
          secureTextEntry
          value={newPasswordConfirmation}
          onChangeText={confirmNewPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
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
      height: 266,
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
  });


  export default PasswordResetScreen;