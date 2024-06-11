import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import db from '../firebaseConfig.js';
import { collection, getDocs } from "firebase/firestore";

const HomeScreen = () => {
  const route = useRoute();
  const user = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.formName}>Form's Name</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual image URL or local image
        style={styles.trainerPic}
      />
      <Text style={styles.trainerName}> {user["userData"]["name"]} is teacher </Text>
      <Text style={styles.formDetails}>Form details: {"\n"}Status: Filled/Empty</Text>
      <Button
        title="To fill the form"
        onPress={() => alert('Form Button Pressed')}
      />
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
});

export default HomeScreen;
