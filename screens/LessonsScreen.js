import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LessonsScreen = () => {
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonTeacher, setLessonTeacher] = useState('');
  const [lessonForm, setLessonForm] = useState('');

  const handleSaveLesson = async () => {
    if (!lessonName || !lessonGroup || !lessonTeacher || !lessonForm) {
      alert('Please fill in all fields');
      return;
    }

    const newLesson = {
      id: Date.now().toString(),
      name: lessonName,
      group: lessonGroup,
      teacher: lessonTeacher,
      form: lessonForm,
    };

    try {
      const existingLessons = await AsyncStorage.getItem('lessons');
      const lessons = existingLessons ? JSON.parse(existingLessons) : [];
      lessons.push(newLesson);
      await AsyncStorage.setItem('lessons', JSON.stringify(lessons));
      alert('Lesson saved successfully!');
      setLessonName('');
      setLessonGroup('');
      setLessonTeacher('');
      setLessonForm('');
    } catch (e) {
      console.error('Error saving lesson:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Lesson</Text>
      <TextInput
        style={styles.input}
        placeholder="Lesson Name"
        value={lessonName}
        onChangeText={setLessonName}
      />
      <TextInput
        style={styles.input}
        placeholder="Lesson Group"
        value={lessonGroup}
        onChangeText={setLessonGroup}
      />
      <TextInput
        style={styles.input}
        placeholder="Lesson Teacher"
        value={lessonTeacher}
        onChangeText={setLessonTeacher}
      />
      <TextInput
        style={styles.input}
        placeholder="Lesson Form"
        value={lessonForm}
        onChangeText={setLessonForm}
      />
      <Button title="Save Lesson" onPress={handleSaveLesson} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
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

export default LessonsScreen;
