import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const handleLogin = async() => {
    const users = await getDocs(collection(db, "users"));
    let user = undefined;
    users.forEach((doc) => {
      if(email==doc.data()["email"] && password == doc.data()["password"]){
        user = doc;
      };
    });
    if(user == undefined){
      alert("Wrong Email or Password"); //edited by akira at 11:17am-13/06
    }
    else{
      const userData = user.data()
      navigation.navigate('HomePage', { userData });  
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
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      <TouchableOpacity onPress={() => navigation.navigate('Verify')}>
        <Text style={styles.forgotPassword}>Forgot Password ?</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <View style={styles.socialIconsContainer}>
        <TouchableOpacity onPress={() => handlePress('https://www.instagram.com/shah2range?igsh=MXY5Mm9saDB6dDUyeg==')}>
        <Image source={require('../assets/image.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handlePress('https://www.facebook.com/Shah2Range/')}>
        <Image source={require('../assets/f.png')} style={styles.socialIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('whatsapp://send?phone=+972587130219')}>
        <Image source={require('../assets/whatsapp.png')} style={styles.socialIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('https://linktr.ee/Shah2Range?fbclid=PAZXh0bgNhZW0CMTEAAaZhHwcDfLHrpSPyrTdeMiOBkjP_Uotaln123aGm4UN9_oZ7WS13lmrptXE_aem_AcTYse1PfldAtAWw3GcJnsUj2T0DlxfAnsTnauWgr5oZJOnIeiMzbG3lAwYrJxkb5c3NLRAoDkRo_qyggPbkRwa0')}>
        <Image source={require('../assets/web.png')} style={styles.web} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress('mailto:Contact@shah2range.com')}>
        <Image source={require('../assets/email.png')} style={styles.socialIcon} />
      </TouchableOpacity>
    </View>
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
