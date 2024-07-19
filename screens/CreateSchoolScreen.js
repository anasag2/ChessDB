import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SchoolsScreen = () => {
  const [schoolName, setSchoolName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorContact, setSupervisorContact] = useState('');

  const saveSchool = async () => {
    const newSchool = {
      id: new Date().toISOString(),
      schoolName,
      supervisorName,
      supervisorContact,
    };

    try {
      const jsonValue = await AsyncStorage.getItem('schools');
      const schools = jsonValue != null ? JSON.parse(jsonValue) : [];
      schools.push(newSchool);
      await AsyncStorage.setItem('schools', JSON.stringify(schools));
      Alert.alert('School saved successfully!');
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
      <TouchableOpacity style={[styles.roundButton, styles.saveButton]} onPress={saveSchool}>
        <Text style={styles.buttonText}>Save School</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3', // Blue 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SchoolsScreen;
