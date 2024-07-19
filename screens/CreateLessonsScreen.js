import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const LessonsScreen = () => {
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonTeacher, setLessonTeacher] = useState('');
  const [lessonForm, setLessonForm] = useState('');
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // Load groups, teachers, and forms here
    setGroups(['Group 1', 'Group 2', 'Group 3']);
    setTeachers(['Teacher 1', 'Teacher 2', 'Teacher 3']);
    setForms(['Form 1', 'Form 2', 'Form 3']);
  }, []);

  const saveLesson = async () => {
    const newLesson = {
      id: new Date().toISOString(),
      name: lessonName,
      group: lessonGroup,
      teacher: lessonTeacher,
      form: lessonForm,
    };

    try {
      const jsonValue = await AsyncStorage.getItem('lessons');
      const lessons = jsonValue != null ? JSON.parse(jsonValue) : [];
      lessons.push(newLesson);
      await AsyncStorage.setItem('lessons', JSON.stringify(lessons));
      Alert.alert('Lesson saved successfully!');
    } catch (e) {
      console.error('Error saving lesson:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Lesson</Text>
      <TextInput
        style={styles.input}
        placeholder="Lesson Name"
        value={lessonName}
        onChangeText={setLessonName}
      />
      <Picker
        selectedValue={lessonGroup}
        onValueChange={(itemValue) => setLessonGroup(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Group" value="" />
        {groups.map((group, index) => (
          <Picker.Item key={index} label={group} value={group} />
        ))}
      </Picker>
      <Picker
        selectedValue={lessonTeacher}
        onValueChange={(itemValue) => setLessonTeacher(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Teacher" value="" />
        {teachers.map((teacher, index) => (
          <Picker.Item key={index} label={teacher} value={teacher} />
        ))}
      </Picker>
      <Picker
        selectedValue={lessonForm}
        onValueChange={(itemValue) => setLessonForm(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Form" value="" />
        {forms.map((form, index) => (
          <Picker.Item key={index} label={form} value={form} />
        ))}
      </Picker>
      <TouchableOpacity style={[styles.roundButton, styles.saveButton]} onPress={saveLesson}>
        <Text style={styles.buttonText}>Save Lesson</Text>
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
    backgroundColor: '#2196F3', // Blue color
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LessonsScreen;
