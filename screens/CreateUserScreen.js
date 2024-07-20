import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const CreateUserScreen = () => {
  const initialFormData = {
    id: '',
    name: '',
    place_of_residence: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'male',
    role: 'teacher',
  };

  const initialEditingState = {
    id: true,
    name: true,
    place_of_residence: true,
    email: true,
    password: true,
    phone_number: true,
    gender: true,
    role: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(initialEditingState);

  const handleConfirm = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const checkData = () => {
    for (let [_, value] of Object.entries(formData)) {
      if (value === ""){
        return false;
      }
    }
    return true;
  };

  const emailValidation = () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+(@gmail\.com)$/;
    return gmailRegex.test(formData["email"]);
  };

  const passwordValidation = () => {
    p = formData["password"];
    numCounter = 0;
    if(p.length === 0 || p.length < 8){
      return false;
    }
    for (let char of p) {
      let charCode = char.charCodeAt(0);
      if(charCode >= 48 && charCode <= 57){
        numCounter += 1;
      }
    }
    if(numCounter < 3){
       return false;
    }
    return true;
  };

  const handleSave = async() => {
    //console.log('User Data:', JSON.stringify(formData));
    let not_exist = true;
    const usersRef = collection(db, "users");
    const users = await getDocs(usersRef);
    users.forEach((doc) => {
      if (formData["id"] == doc.id) {
        console.log(doc.id);
        console.log(formData["id"]);
        not_exist = false;
      }
    });
    if(not_exist === false){
      alert("invalid id");
    }else{
      if(checkData() === false){
        alert("you have some missing data for this user");
      } else{ 
        if (emailValidation() === false){
          alert("unsupported email");
        }else {
          if(passwordValidation() === false){
            alert("you have entered an invalid password\npassword should be made up of 3 numbers annd 5 letters at least");
          }else{
            await setDoc(doc(usersRef, formData["id"]), {
              name : formData["name"],
              email : formData["email"],
              password : formData["password"],
              phone_number : formData["phone_number"],
              gender : formData["gender"],
              role : formData["role"],
              groups : [],
              forms_to_fill : {},
              place_of_residence: formData["place_of_residence"],
            });
            alert("User added successfully!");
            // Reset formData and isEditing states
            setFormData(initialFormData);
            setIsEditing(initialEditingState);
          }
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(formData).map((field) => (
        <View key={field} style={styles.fieldContainer}>
          {isEditing[field] ? (
            field !== 'role' && field !== "gender" && field !== "phone_number" && field !== "place_of_residence" ? (
              <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter ${field}`}
                secureTextEntry={field === 'password'}
                keyboardType={field === 'id' ? 'number-pad' : 'default'}
              />
            ) : (
              field === "phone_number" ? (
                <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
                keyboardType='number-pad'
                placeholder={`Enter phone number`}
                secureTextEntry={field === 'password'}
              />
              ) : (
                field === "place_of_residence" ? (
                  <TextInput
                  style={styles.input}
                  value={formData[field]}
                  onChangeText={(text) => handleChange(field, text)}
                  placeholder={`Enter place of residence`}
                  secureTextEntry={field === 'password'}
                />
                ) : (
              field === "role" ? (
                <Picker
                selectedValue={formData[field]}
                style={styles.input}
                onValueChange={(itemValue) => handleChange(field, itemValue)}
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Teacher" value="teacher" />
              </Picker>
              ) :(
              <Picker
                selectedValue={formData[field]}
                style={styles.input}
                onValueChange={(itemValue) => handleChange(field, itemValue)}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
              ) 
            )
          )
          )
          ) : (
            <Text style={styles.label}>{formData[field]}</Text>
          )}
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  label: {
    padding: 10,
    fontSize: 16,
  },
});

export default CreateUserScreen;