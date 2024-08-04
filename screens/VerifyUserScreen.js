import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";

const VerifyUserScreen = () => {
    const [email, setEmail] = useState('');
    const [ID, setId] = useState('');
    const navigation = useNavigation();
  
    const handleVerify= async() => {
      const users = await getDocs(collection(db, "users"));
      let user = undefined;
      users.forEach((doc) => {
        if(email==doc.data()["email"] && ID == doc.id){
          user = doc;
        };
      });
      if(user == undefined){
        alert("You have entered wrong Gmail or ID");
      }
      else{
        let userID = user.id
        let userData = user.data()
        navigation.navigate('ResetPassword', { userID, userData });  
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
            placeholder="ID"
            keyboardType="number-pad"
            value={String}
            onChangeText={setId}
          />
          <TextInput
            style={styles.input}
            placeholder="Gmail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
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


  export default VerifyUserScreen;