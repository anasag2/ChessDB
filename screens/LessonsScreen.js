// LessonsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import db from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const groups = [
  { label: 'Group A', value: 'groupA' },
  { label: 'Group B', value: 'groupB' },
  { label: 'Group C', value: 'groupC' },
];

const teachers = [
  { label: 'Teacher 1', value: 'teacher1' },
  { label: 'Teacher 2', value: 'teacher2' },
  { label: 'Teacher 3', value: 'teacher3' },
];

const forms = [
  { label: 'Form 1', value: 'form1' },
  { label: 'Form 2', value: 'form2' },
  { label: 'Form 3', value: 'form3' },
];

const LessonsScreen = () => {
  const [lessonName, setLessonName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const navigation = useNavigation();

  const saveLesson = async () => {
    if (!lessonName || !selectedGroup || !selectedTeacher || !selectedForm) {
      Alert.alert('All fields are required!');
      return;
    }

    const newLesson = {
      id: Date.now().toString(),
      name: lessonName,
      group: selectedGroup,
      teacher: selectedTeacher,
      form: selectedForm,
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, 'lessons'), newLesson);

      // Save to JSON file
      const fileUri = FileSystem.documentDirectory + 'lessons.json';
      const existingData = await FileSystem.readAsStringAsync(fileUri).catch(() => '[]');
      const lessons = JSON.parse(existingData);
      lessons.push(newLesson);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(lessons));

      Alert.alert('Lesson saved successfully!');
      setLessonName('');
      setSelectedGroup('');
      setSelectedTeacher('');
      setSelectedForm('');
    } catch (error) {
      Alert.alert('Error saving lesson', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lesson Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Lesson Name"
        value={lessonName}
        onChangeText={setLessonName}
      />
      <Picker
        selectedValue={selectedGroup}
        onValueChange={(itemValue) => setSelectedGroup(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Group" value="" />
        {groups.map((group) => (
          <Picker.Item key={group.value} label={group.label} value={group.value} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedTeacher}
        onValueChange={(itemValue) => setSelectedTeacher(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Teacher" value="" />
        {teachers.map((teacher) => (
          <Picker.Item key={teacher.value} label={teacher.label} value={teacher.value} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedForm}
        onValueChange={(itemValue) => setSelectedForm(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Form" value="" />
        {forms.map((form) => (
          <Picker.Item key={form.value} label={form.label} value={form.value} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={saveLesson}>
        <Text style={styles.buttonText}>Save Lesson</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LessonsScreen;
