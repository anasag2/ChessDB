import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateLessonScreen = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonTeacher, setLessonTeacher] = useState('');
  const [lessonForm, setLessonForm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('lessons');
      const loadedLessons = jsonValue != null ? JSON.parse(jsonValue) : [];
      setLessons(loadedLessons.sort((a, b) => a.name.localeCompare(b.name)));
      setFilteredLessons(loadedLessons.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) {
      console.error('Error loading lessons:', e);
    }
  };

  const handleSearch = () => {
    const filtered = lessons.filter((lesson) =>
      lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLessons(filtered.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const handleLessonSelect = (lessonId) => {
    const lesson = lessons.find((lesson) => lesson.id === lessonId);
    setSelectedLesson(lesson);
    setLessonName(lesson.name);
    setLessonGroup(lesson.group);
    setLessonTeacher(lesson.teacher);
    setLessonForm(lesson.form);
    setModalVisible(true);
  };

  const handleUpdateLesson = async () => {
    const updatedLessons = lessons.map((lesson) =>
      lesson.id === selectedLesson.id
        ? { ...lesson, name: lessonName, group: lessonGroup, teacher: lessonTeacher, form: lessonForm }
        : lesson
    );

    try {
      await AsyncStorage.setItem('lessons', JSON.stringify(updatedLessons));
      alert('Lesson updated successfully!');
      loadLessons();
      setModalVisible(false);
    } catch (e) {
      console.error('Error updating lesson:', e);
    }
  };

  const handleDeleteLesson = async () => {
    const filteredLessons = lessons.filter((lesson) => lesson.id !== selectedLesson.id);

    try {
      await AsyncStorage.setItem('lessons', JSON.stringify(filteredLessons));
      alert('Lesson deleted successfully!');
      loadLessons();
      setModalVisible(false);
    } catch (e) {
      console.error('Error deleting lesson:', e);
    }
  };

  const renderLesson = ({ item }) => (
    <TouchableOpacity onPress={() => handleLessonSelect(item.id)}>
      <View style={styles.lessonContainer}>
        {highlightText(item.name, searchQuery)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Lesson</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Lessons"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        style={styles.list}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
            <Button title="Update Lesson" onPress={handleUpdateLesson} />
            <Button title="Delete Lesson" onPress={handleDeleteLesson} color="red" />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  lessonContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  highlight: {
    backgroundColor: 'yellow',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default UpdateLessonScreen;
