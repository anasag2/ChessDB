import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Linking, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";
import { useRoute } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';

const AdminActionScreen = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigation = useNavigation();
  // const handlePress = (url) => {
  //   Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  // };
  const route = useRoute();
  const user = route.params;
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };


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
    
      <View style={styles.container}>
       <View style={styles.card}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={selectedImage ? { uri: selectedImage } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.trainerPic}
          />
        </TouchableOpacity>
        <Text style={styles.trainerName}> {user["userData"]["name"]} is a Admin </Text>
      </View>
      <View style={styles.takePhoto}>
      <Button title="Take a photo" onPress={takePhoto} />
      </View>
    <View>
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
    </View>
 
    </View>
  );
};


const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 16,
  },
  takePhoto: {
    marginBottom: 20,
  },
  formItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkmark: {
    color: 'green',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  trainerPic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  trainerName: {
    fontSize: 18,
    marginBottom: 20,
  },
  formDetails: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default AdminActionScreen;
