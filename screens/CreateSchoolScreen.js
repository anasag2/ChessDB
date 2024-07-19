import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateSchoolScreen = () => {
  const [schoolName, setSchoolName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorContact, setSupervisorContact] = useState('');

  const handleSaveSchool = async () => {
    try {
      const schools = await AsyncStorage.getItem('schools');
      const schoolsArray = schools ? JSON.parse(schools) : [];
      const newSchool = {
        id: Date.now().toString(),
        schoolName,
        supervisorName,
        supervisorContact,
      };
      schoolsArray.push(newSchool);
      await AsyncStorage.setItem('schools', JSON.stringify(schoolsArray));
      alert('School saved successfully!');
      setSchoolName('');
      setSupervisorName('');
      setSupervisorContact('');
    } catch (e) {
      console.error('Error saving school:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create School</Text>
      <TextInput
        style={styles.input}
        placeholder="School Name"
        value={schoolName}
        onChangeText={setSchoolName}
      />
      <TextInput
        style={styles.input}
        placeholder="Supervisor Name"
        value={supervisorName}
        onChangeText={setSupervisorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Supervisor Contact"
        value={supervisorContact}
        onChangeText={setSupervisorContact}
        keyboardType="phone-pad"
      />
      <Button title="Save School" onPress={handleSaveSchool} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
});

export default CreateSchoolScreen;
