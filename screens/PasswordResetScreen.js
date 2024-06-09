import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const PasswordResetScreen = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, confirmNewPassword] = useState('');
    const navigation = useNavigation();
  
    const validateEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };
  
    const handleReset = () => {
    //   if (!validateEmail(email)) {
    //     Alert.alert('Invalid email format');
    //     return;
    //   }
    //   if (password.length < 6) {
    //     Alert.alert('Password must be at least 6 characters long');
    //     return;
    //   }
       navigation.navigate('Login');
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