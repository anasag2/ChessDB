import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';

const CreateGroupScreen = ({ navigation }) => {
  const initialFormData = {
    groupName: '', // Field for the group's name
    class: '',
    school: '',
  };

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const teachers = [
    { id: 1, name: 'Sami' },
    { id: 2, name: 'Abdallah' },
    { id: 3, name: 'Karmi' },
    { id: 4, name: 'Ahmad' },
    { id: 5, name: 'Anas' },
  ];

  // useLayoutEffect(() => {
  //   console.log('navigation', navigation);
  //   navigation.setOptions({
  //     headerTitle: 'Create Group',
  //     headerStyle: {
  //       backgroundColor: '#f5f5f5', // Example background color
  //     },
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //       // fontFamily: 'IBMPlexSans-Regular', // Ensure your custom font is loaded appropriately
  //     },
  //     headerTintColor: '#663D99', // Color for header back button and title
  //   });
  // }, [navigation]);

  const [formData, setFormData] = useState(initialFormData);
  const fields = Object.keys(formData);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.groupName) {
      alert("Please enter a group name.");
      return;
    }
    
    let groupExists = false;
    const groupsSnapshot = await getDocs(collection(db, 'groups'));
    groupsSnapshot.forEach(doc => {
      if (doc.data().groupName === formData.groupName) {
        groupExists = true;
      }
    });

    if (groupExists) {
      alert("A group with this name already exists.");
    } else {
      const groupData = {
        ...formData,
        teachers: selectedTeachers,
      };

      await setDoc(doc(db, 'groups', formData.groupName), groupData);
      alert("Group added successfully!");

      setFormData(initialFormData);
      setSelectedTeachers([]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        keyExtractor={item => item}
        renderItem={({ item: field }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</Text>
            {field === 'school' ? (
              <Picker
                selectedValue={formData.school}
                onValueChange={itemValue => handleChange('school', itemValue)}
                style={styles.input}>
                <Picker.Item label="School 1" value="school1" />
                <Picker.Item label="School 2" value="school2" />
              </Picker>
            ) : (
              <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={text => handleChange(field, text)}
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}`}
                keyboardType={field === 'coachNumber' ? 'number-pad' : 'default'}
              />
            )}
          </View>
        )}
        ListFooterComponent={(
          <>
            <MultiSelect
              items={teachers}
              uniqueKey="id"
              onSelectedItemsChange={setSelectedTeachers}
              selectedItems={selectedTeachers}
              selectText="Pick Teachers"
              searchInputPlaceholderText="Search Teachers..."
              tagRemoveIconColor={colors.yellow}
              tagBorderColor={colors.purple}
              tagTextColor={colors.purple}
              selectedItemTextColor={colors.yellow}
              selectedItemIconColor={colors.yellow}
              itemTextColor={colors.purple}
              displayKey="name"
              searchInputStyle={{ color: colors.purple }}
              submitButtonColor={colors.yellow}
              submitButtonText="Submit"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonStyle} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </View>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F'
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: colors.lightGrey,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.purple,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    color: colors.purple,
    backgroundColor: '#FFFFFF'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.purple,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: colors.yellow,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    color: colors.purple,
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default CreateGroupScreen;
