import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, Button, StyleSheet } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { FlatList } from 'react-native';

const CreateGroupScreen = () => {
  const initialFormData = {
    class: '',
    school: '',
    coachName: '',
    coachNumber: '',
  };

  const initialEditingState = {
    class: true,
    school: true,
    coachName: true,
    coachNumber: true,
  };

  const [selectedTeachers, setSelectedTeachers] = useState([]);

  //this constant is what needs to be pulled out of the etachers collection in the database
  const teachers = [
    { id: 1, name: 'Sami' },
    { id: 2, name: 'Abdallah' },
    { id: 3, name: 'Karmi' },
    { id: 4, name: 'Ahmad' },
    { id: 5, name: 'Anas' },
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(initialEditingState);
  const fields = Object.keys(formData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
  // Check if group already exists in the database
  let groupExists = false;
  const groupsSnapshot = await getDocs(collection(db, 'groups'));
  groupsSnapshot.forEach((doc) => {
    if (formData.id === doc.id) {
      groupExists = true;
    }
  });

  if (groupExists) {
    alert("A group with this ID already exists.");
  } else {
    const groupData = {
      ...formData,
      teachers: selectedTeachers,
    };

    // Save to Firebase
    await setDoc(doc(db, 'groups', formData.id), groupData);
    alert("Group added successfully!");

    // Reset formData and isEditing states
    setFormData(initialFormData);
    setIsEditing(initialEditingState);
    setSelectedTeachers([]);
  }
};

  return (
    <View style={styles.container}>
    <FlatList
      data={fields}
      keyExtractor={(item) => item}
      renderItem={({ item: field }) => (
        <View style={styles.fieldContainer}>
          {field === 'school' ? (
            <Picker
              selectedValue={formData.school}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, school: itemValue })
              }>
              <Picker.Item label="School 1" value="school1" />
              <Picker.Item label="School 2" value="school2" />
              {/* Add more schools as needed */}
            </Picker>
          ) : (
            <TextInput
              style={styles.input}
              value={formData[field]}
              onChangeText={(text) => handleChange(field, text)}
              placeholder={`Enter ${field}`}
              keyboardType={field === 'coachNumber' ? 'number-pad' : 'default'}
            />
          )}
        </View>
      )}
    />
    <MultiSelect
      items={teachers}
      uniqueKey="id"
      onSelectedItemsChange={setSelectedTeachers}
      selectedItems={selectedTeachers}
      selectText="Pick Teachers"
      searchInputPlaceholderText="Search Teachers..."
      tagRemoveIconColor="#CCC"
      tagBorderColor="#CCC"
      tagTextColor="#CCC"
      selectedItemTextColor="#CCC"
      selectedItemIconColor="#CCC"
      itemTextColor="#000"
      displayKey="name"
      searchInputStyle={{ color: '#CCC' }}
      submitButtonColor="#CCC"
      submitButtonText="Submit"
    />
    <Button title="Save" onPress={handleSave} />
  </View>
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