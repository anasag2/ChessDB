import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

const LessonsScreen = () => {
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonGroupId, setLessonGroupId] = useState(''); // To store the selected group's ID
  const [lessonTeacher, setLessonTeacher] = useState('');
  const [lessonTeacherId, setLessonTeacherId] = useState(''); // To store the selected teacher's ID
  const [lessonForm, setLessonForm] = useState('');
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [forms, setForms] = useState([]);

  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);

  const [filteredGroups, setFilteredGroups] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);

  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [formSearchQuery, setFormSearchQuery] = useState('');

  useEffect(() => {
    // Load groups, teachers, and forms from Firestore
    const fetchData = async () => {
      const loadedGroups = [];
      const loadedTeachers = [];
      const loadedForms = [];

      const groupsRef = collection(db, 'groups');
      const groupsSnapshot = await getDocs(groupsRef);
      groupsSnapshot.forEach((doc) => {
        loadedGroups.push({ id: doc.id, name: doc.data().groupName });
      });

      const teachersRef = collection(db, 'teachers');
      const teachersSnapshot = await getDocs(teachersRef);
      teachersSnapshot.forEach((doc) => {
        loadedTeachers.push({ id: doc.id, name: doc.data().name });
      });

      const formsRef = collection(db, 'forms');
      const formsSnapshot = await getDocs(formsRef);
      formsSnapshot.forEach((doc) => {
        loadedForms.push(doc.id);
      });

      setGroups(loadedGroups);
      setTeachers(loadedTeachers);
      setForms(loadedForms);

      setFilteredGroups(loadedGroups);
      setFilteredTeachers(loadedTeachers);
      setFilteredForms(loadedForms);
    };

    fetchData();
  }, []);

  const saveLesson = async () => {
    const newLesson = {
      id: new Date().toISOString(),
      name: lessonName,
      group: lessonGroupId, // Store the group ID
      teacher: lessonTeacherId, // Store the teacher ID
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

  const handleGroupSearch = (text) => {
    setGroupSearchQuery(text);
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleTeacherSearch = (text) => {
    setTeacherSearchQuery(text);
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const handleFormSearch = (text) => {
    setFormSearchQuery(text);
    const filtered = forms.filter((form) =>
      form.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredForms(filtered);
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

  const renderItem = ({
    item,
    searchQuery,
    setSelectedItem,
    setSelectedItemId, // Function to set the selected item's ID
    setModalVisible,
  }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedItem(item.name);
        setSelectedItemId(item.id);
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemText}>{highlightText(item.name, searchQuery)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Lesson</Text>
      <TextInput
        style={styles.input}
        placeholder="Lesson Name"
        value={lessonName}
        onChangeText={setLessonName}
      />

      {/* Group Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setGroupModalVisible(true)}
      >
        <Text>{lessonGroup || 'Select Group'}</Text>
      </TouchableOpacity>
      <Modal
        visible={groupModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Group"
              value={groupSearchQuery}
              onChangeText={handleGroupSearch}
            />
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  searchQuery: groupSearchQuery,
                  setSelectedItem: setLessonGroup,
                  setSelectedItemId: setLessonGroupId,
                  setModalVisible: setGroupModalVisible,
                })
              }
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.cancelButton]}
              onPress={() => setGroupModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Teacher Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setTeacherModalVisible(true)}
      >
        <Text>{lessonTeacher || 'Select Teacher'}</Text>
      </TouchableOpacity>
      <Modal
        visible={teacherModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Teacher"
              value={teacherSearchQuery}
              onChangeText={handleTeacherSearch}
            />
            <FlatList
              data={filteredTeachers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  searchQuery: teacherSearchQuery,
                  setSelectedItem: setLessonTeacher,
                  setSelectedItemId: setLessonTeacherId,
                  setModalVisible: setTeacherModalVisible,
                })
              }
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.cancelButton]}
              onPress={() => setTeacherModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Form Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setFormModalVisible(true)}
      >
        <Text>{lessonForm || 'Select Form'}</Text>
      </TouchableOpacity>
      <Modal
        visible={formModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Form"
              value={formSearchQuery}
              onChangeText={handleFormSearch}
            />
            <FlatList
              data={filteredForms}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderItem({
                  item,
                  searchQuery: formSearchQuery,
                  setSelectedItem: setLessonForm,
                  setModalVisible: setFormModalVisible,
                })
              }
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.cancelButton]}
              onPress={() => setFormModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.roundButton, styles.saveButton]}
        onPress={saveLesson}
      >
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
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    width: '100%',
  },
  itemText: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: 'yellow',
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#777', // Gray color for cancel button
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LessonsScreen;