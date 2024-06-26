import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const VerifyUserScreen = () => {
    const [email, setEmail] = useState('');
    const [ID, setId] = useState('');
    const navigation = useNavigation();
  
    // const validateEmail = (email) => {
    //   const re = /\S+@\S+\.\S+/;
    //   return re.test(email);
    // };
  
    const handleVerify= () => {
      // if (!validateEmail(email)) {
      //   Alert.alert('Invalid email format');
      //   return;
      // }
      // if (ID.length < 8) {
      //   Alert.alert('ID Not valid');
      //   return;
      // }
      navigation.navigate('ResetPassword');
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
            placeholder="Email"
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