import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../firebaseConfig.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

const SchoolsScreen = () => {
  const [schoolName, setSchoolName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorContact, setSupervisorContact] = useState('');

  const saveSchool = async () => {
    const newSchool = {
      schoolName,
      supervisorName,
      supervisorContact,
    };

    try {
      //const jsonValue = await AsyncStorage.getItem('schools');
      //console.log(newSchool);
      const schoolsRef = collection(db, "schools");
      const schools = await getDocs(schoolsRef);
      let school = undefined;
      schools.forEach((doc) => {
        if(newSchool.schoolName===doc.id){
          school = doc;
        };
      });
      if(school !== undefined){
        alert("school already exist"); //edited by akira at 11:17am-13/06
      }
      else{
        const schoolDoc = doc(schoolsRef, newSchool.schoolName);
        await setDoc(schoolDoc, {
          supervisorName: newSchool.supervisorName,
          supervisorContact: newSchool.supervisorContact,
        });
        Alert.alert('School saved successfully!');
      }
      setSchoolName("");
      setSupervisorContact("");
      setSupervisorName("");
      // const schools = jsonValue != null ? JSON.parse(jsonValue) : [];
      // schools.push(newSchool);
      // await AsyncStorage.setItem('schools', JSON.stringify(schools));
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

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F',
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
    color: colors.purple,
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
    backgroundColor: colors.purple,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SchoolsScreen;
