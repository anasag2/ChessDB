import React, { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image, Button } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

const AdminHomeScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button title="Take a photo" onPress={takePhoto} />
      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual image URL or local image
          style={styles.trainerPic}
        />
        )}
      </TouchableOpacity>
      <Text style={styles.trainerName}> {user["userData"]["name"]} is a Admin </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trainerPic: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
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

export default AdminHomeScreen;
