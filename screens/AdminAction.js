import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Button, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL,getStorage } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const AdminActionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params;
  const [selectedImage, setSelectedImage] = useState(user.userData.profileImageUrl || 'https://via.placeholder.com/150');

  const db = getStorage();  // Ensure this is properly initialized

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    //const storageRef = ref(storage, `profileImages/${Date.now()}_${uri.split('/').pop()}`);
    const storageRef = ref(storage, "profileImages");
  
    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log("Uploaded Image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  

  const pickImage = async () => {
    console.log("PickImage initiated");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Inside PickImage, after image picker");
  
    if (!result.canceled) {
      console.log("Result from picker:", result);
      try {
        const imageUrl = await uploadImage(result.assets[0].uri);
        console.log("Uploaded Image URL:", imageUrl);
        await updateUserImage(user.id, imageUrl);
        setSelectedImage(imageUrl);
      } catch (error) {
        console.error("Error during image upload or updating user profile:", error);
      }
    }
  };

  const takePhoto = async () => {
    console.log("takePhoto");
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions required', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Inside takePhoto");
    if (!result.canceled) {
      console.log("takePhoto !result.canceled");
      const imageUrl = await uploadImage(result.uri);
      updateUserImage(user.id, imageUrl);
      setSelectedImage(imageUrl);
    }
  };

  const updateUserImage = async (userId, imageUrl) => {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        profileImageUrl: imageUrl
      });
      Alert.alert('Success', 'Profile image updated successfully.');
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert('Error', 'Failed to update profile image.');
    }
  };


  const handleUser = async () => {
    actionType = "User";
    navigation.navigate('CRUDPage', { actionType });
  };

  const handleForms = async () => {
    actionType = "Form";
    navigation.navigate('CRUDPage', { actionType });
  };

  const handleGroup = async () => {
    actionType = "Group";
    navigation.navigate('CRUDPage', { actionType });
  };

  const handleSchools = async () => {
    actionType = "Schools";
    navigation.navigate('CRUDPage', { actionType });
  };

  const handleLessons = async () => {
    actionType = "Lessons";
    navigation.navigate('CRUDPage', { actionType });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={selectedImage ? { uri: selectedImage } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.trainerPic}
          />
        </TouchableOpacity>
        <Text style={styles.trainerName}>{user["userData"]["name"]} is an Admin</Text>
      </View>
      <View style={styles.takePhoto}>
        <Button title="Take a photo" onPress={takePhoto} />
      </View>
      <View>
        <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleUser}>
          <Text style={styles.buttonText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleForms}>
          <Text style={styles.buttonText}>Forms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleGroup}>
          <Text style={styles.buttonText}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSchools}>
          <Text style={styles.buttonText}>Schools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleLessons}>
          <Text style={styles.buttonText}>Lessons</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F',
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  takePhoto: {
    marginBottom: 20,
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
    fontSize: 18,
    marginBottom: 20,
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.purple, // Purple color
  },
});

export default AdminActionScreen;