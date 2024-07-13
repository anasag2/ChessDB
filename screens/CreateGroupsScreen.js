import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, Button, StyleSheet } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const CreateGroupScreen = () => {
  const initialFormData = {
    // school: '',
    // teacher: '',
    id: '',
    name: '',
    description: '',
  };

  const initialEditingState = {
    school: true,
    id: true,
    name: true,
    description: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(initialEditingState);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async() => {
    let not_exist = true;
    const groups = await getDocs(collection(db, 'groups'));
    groups.forEach((doc) => {
      if (formData["id"] == doc.id) {
        not_exist = false;
      }
    });
    if(not_exist === false){
      alert("invalid id");
    }else{
      await setDoc(doc(db, 'groups', formData["id"]), {
        name : formData["name"],
        description : formData["description"],
      });
      alert("Group added successfully!");
      // Reset formData and isEditing states
      setFormData(initialFormData);
      setIsEditing(initialEditingState);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(formData).map((field) => (
        <View key={field} style={styles.fieldContainer}>
          {isEditing[field] ? (
            <TextInput
              style={styles.input}
              value={formData[field]}
              onChangeText={(text) => handleChange(field, text)}
              placeholder={`Enter ${field}`}
              keyboardType={field === 'id' ? 'number-pad' : 'default'}
            />
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

export default CreateGroupScreen;