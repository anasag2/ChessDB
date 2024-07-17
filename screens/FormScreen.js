import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';
import db from '../firebaseConfig.js';
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

const FormListScreen =() => {
  const [formDataSet, setForms] = useState([]);
  const [completedForms, setCompletedForms] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params;
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchForms = async () => {
      //console.log(user.userData.forms_to_fill);
      const formsMap = new Map(Object.entries(user.userData.forms_to_fill));
      //console.log(formsMap);
      const forms = [];
      // let questions = {};
      for (const [key, value] of formsMap.entries()) {
        let count = 1;
        let current_form = {name:"", data:[], group:"", userName:user.userData.name, formName:""};
        //console.log(`Key: ${key}, Value: ${value}`);
        current_form.name = `${key} for group ${value}`;
        current_form.formName = key;
        current_form.group = value;
        const docRef = doc(db, "forms", key);
        questions = (await getDoc(docRef)).data().questions;
        const questions_map = new Map(Object.entries(questions));
        //console.log(questions_map);
        for (const [key2, value2] of questions_map.entries()) {
          //console.log(`Key: ${key2}, Value: ${value2}`);
          current_form.data[current_form.data.length] = {id:count, question:key2, type:value2};
          count += 1;
        };
        //console.log(current_form.data);
        forms.push(current_form);
      }
      //console.log(forms);
      setForms(forms);
    };
    
    fetchForms();
  }, []);


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

  const markAsCompleted = (formName) => {
    setCompletedForms((prev) => [...prev, formName]);
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
        <Text style={styles.trainerName}>{user.userData.name} is a Teacher</Text>
      </View>
      <View style={styles.takePhoto}>
      <Button title="Take a photo" onPress={takePhoto} />
      </View>
     
      <Text>Forms to fill</Text>
      <FlatList
        data={formDataSet}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.formItem}
            onPress={() => navigation.navigate('Form', { form: item, markAsCompleted })}
          >
            <Text>{item.name}</Text>
            {completedForms.includes(item.name) && <Text style={styles.checkmark}>✔️</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

});

export default FormListScreen;