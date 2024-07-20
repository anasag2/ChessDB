import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import db from '../firebaseConfig.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, writeBatch } from 'firebase/firestore';

const UpdateLessonScreen = () => {
  const [originalLessons, setOriginalLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonTeacher, setLessonTeacher] = useState('');
  const [lessonForm, setLessonForm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLesson, setCurrentLesson] = useState('');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const lessonsRef = collection(db, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsRef);
      const loadedLessons = lessonsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOriginalLessons(loadedLessons.sort((a, b) => a.name.localeCompare(b.name)));
      setLessons(loadedLessons.sort((a, b) => a.name.localeCompare(b.name)));
      console.log(loadedLessons);
    } catch (e) {
      console.error('Error loading lessons:', e);
    }
  };

  const handleLessonSelect = async(lessonId) => {
    const lesson = lessons.find((lesson) => lesson.id === lessonId);
    setSelectedLesson(lesson);
    const usersRef = collection(db, "users");
    const userDoc = doc(usersRef, lesson.teacher);
    let user = (await getDoc(userDoc)).data();
    const groupsRef = collection(db, "groups");
    const groupDoc = doc(groupsRef, lesson.group);
    let group = (await getDoc(groupDoc)).data();
    setLessonName(lesson.name);
    setLessonGroup(group.groupName);
    setLessonTeacher(user.name);
    setLessonForm(lesson.form);
    setModalVisible(true);
    setCurrentLesson(lesson)
  };

  const handleUpdateLesson = async () => {
    if(lessonForm === "" || lessonName === "" || lessonTeacher === "" || lessonGroup === ""){
      alert("you have an empty label");
    }
    else{
      try {
        const lessonRef = doc(db, 'lessons', selectedLesson.id);
        await updateDoc(lessonRef, {
          name: lessonName,
          group: currentLesson.group,
          teacher: currentLesson.teacher,
          form: lessonForm,
        });
        Alert.alert('Lesson updated successfully!');
        loadLessons();
        setModalVisible(false);
      } catch (e) {
        console.error('Error updating lesson:', e);
      }
    };
  };

  const handleDeleteLesson = async () => {
    try {
      const lessonRef = doc(db, 'lessons', selectedLesson.id);
      await deleteDoc(lessonRef);
      Alert.alert('Lesson deleted successfully!');
      const batch = writeBatch(db);
      const usersRef = collection(db, "users");
      const userDoc = doc(usersRef, currentLesson.teacher);
      let user = (await getDoc(userDoc)).data();
      const formsMap = new Map(Object.entries(user.forms_to_fill));
      let forms = {};
      for (const [key, value] of formsMap.entries()) {
        if(key !== currentLesson.group){
          forms[key] = value;
        };
      };
      batch.update(userDoc, {"forms_to_fill": forms});
      await batch.commit();
      loadLessons();
      setModalVisible(false);
    } catch (e) {
      console.error('Error deleting lesson:', e);
    }
  };

  const handleSearch = () => {
    const filtered = originalLessons.filter((lesson) =>
      lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setLessons(filtered.sort((a, b) => a.name.localeCompare(b.name)));
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Lesson</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Lessons"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLessonSelect(item.id)}>
            <View style={styles.lessonContainer}>
              {highlightText(item.name, searchQuery)}
            </View>
          </TouchableOpacity>
        )}
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
            <TouchableOpacity style={[styles.roundButton, styles.updateButton]} onPress={handleUpdateLesson}>
              <Text style={styles.buttonText}>Update Lesson</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roundButton, styles.deleteButton]} onPress={handleDeleteLesson}>
              <Text style={styles.buttonText}>Delete Lesson</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roundButton, styles.closeButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: colors.lightGrey,
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  list: {
    marginBottom: 20,
  },
  lessonContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  highlight: {
    backgroundColor: colors.yellow,
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
    borderRadius: 20,
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.purple, // Purple color
  },
  updateButton: {
    backgroundColor: colors.purple, // Purple color
  },
  deleteButton: {
    backgroundColor: 'red', // Red color for delete button
  },
  closeButton: {
    backgroundColor: '#777', // Gray color for close button
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateLessonScreen;
