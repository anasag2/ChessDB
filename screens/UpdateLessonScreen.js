// UpdateLessonScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

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

const UpdateLessonScreen = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonName, setLessonName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadLessons = async () => {
      const fileUri = FileSystem.documentDirectory + 'lessons.json';
      const existingData = await FileSystem.readAsStringAsync(fileUri).catch(() => '[]');
      setLessons(JSON.parse(existingData));
    };

    loadLessons();
  }, []);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonName(lesson.name);
    setSelectedGroup(lesson.group);
    setSelectedTeacher(lesson.teacher);
    setSelectedForm(lesson.form);
  };

  const updateLesson = async () => {
    if (!lessonName || !selectedGroup || !selectedTeacher || !selectedForm) {
      Alert.alert('All fields are required!');
      return;
    }

    const updatedLessons = lessons.map((lesson) =>
      lesson.id === selectedLesson.id
        ? { ...lesson, name: lessonName, group: selectedGroup, teacher: selectedTeacher, form: selectedForm }
        : lesson
    );

    setLessons(updatedLessons);

    const fileUri = FileSystem.documentDirectory + 'lessons.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedLessons));

    Alert.alert('Lesson updated successfully!');
    setSelectedLesson(null);
    setLessonName('');
    setSelectedGroup('');
    setSelectedTeacher('');
    setSelectedForm('');
  };

  const deleteLesson = async () => {
    const filteredLessons = lessons.filter((lesson) => lesson.id !== selectedLesson.id);

    setLessons(filteredLessons);

    const fileUri = FileSystem.documentDirectory + 'lessons.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(filteredLessons));

    Alert.alert('Lesson deleted successfully!');
    setSelectedLesson(null);
    setLessonName('');
    setSelectedGroup('');
    setSelectedTeacher('');
    setSelectedForm('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Lesson</Text>
      <Picker
        selectedValue={selectedLesson ? selectedLesson.id : ''}
        onValueChange={(itemValue) => {
          const lesson = lessons.find((lesson) => lesson.id === itemValue);
          selectLesson(lesson);
        }}
        style={styles.input}
      >
        <Picker.Item label="Select Lesson" value="" />
        {lessons.map((lesson) => (
          <Picker.Item key={lesson.id} label={lesson.name} value={lesson.id} />
        ))}
      </Picker>
      {selectedLesson && (
        <>
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
          <TouchableOpacity style={styles.button} onPress={updateLesson}>
            <Text style={styles.buttonText}>Update Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={deleteLesson}>
            <Text style={styles.buttonText}>Delete Lesson</Text>
          </TouchableOpacity>
        </>
      )}
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

export default UpdateLessonScreen;
