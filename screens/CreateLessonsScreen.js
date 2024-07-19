import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LessonsScreen = () => {
  const [lessonName, setLessonName] = useState('');
  const [lessonGroup, setLessonGroup] = useState('');
  const [lessonTeacher, setLessonTeacher] = useState('');
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
    // Load groups, teachers, and forms here
    const loadedGroups = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'];
    const loadedTeachers = ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4', 'Teacher 5'];
    const loadedForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];

    setGroups(loadedGroups);
    setTeachers(loadedTeachers);
    setForms(loadedForms);

    setFilteredGroups(loadedGroups);
    setFilteredTeachers(loadedTeachers);
    setFilteredForms(loadedForms);
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

  const handleGroupSearch = (text) => {
    setGroupSearchQuery(text);
    const filtered = groups.filter(group => group.toLowerCase().includes(text.toLowerCase()));
    setFilteredGroups(filtered);
  };

  const handleTeacherSearch = (text) => {
    setTeacherSearchQuery(text);
    const filtered = teachers.filter(teacher => teacher.toLowerCase().includes(text.toLowerCase()));
    setFilteredTeachers(filtered);
  };

  const handleFormSearch = (text) => {
    setFormSearchQuery(text);
    const filtered = forms.filter(form => form.toLowerCase().includes(text.toLowerCase()));
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

  const renderItem = ({ item, searchQuery, setSelectedItem, setModalVisible }) => (
    <TouchableOpacity onPress={() => { setSelectedItem(item); setModalVisible(false); }}>
      <Text style={styles.itemText}>{highlightText(item, searchQuery)}</Text>
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
      <TouchableOpacity style={styles.input} onPress={() => setGroupModalVisible(true)}>
        <Text>{lessonGroup || 'Select Group'}</Text>
      </TouchableOpacity>
      <Modal visible={groupModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.searchInput} placeholder="Search Group" onChangeText={handleGroupSearch} />
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderItem({ item, searchQuery: groupSearchQuery, setSelectedItem: setLessonGroup, setModalVisible: setGroupModalVisible })}
            />
            <TouchableOpacity style={[styles.roundButton, styles.cancelButton]} onPress={() => setGroupModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Teacher Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setTeacherModalVisible(true)}>
        <Text>{lessonTeacher || 'Select Teacher'}</Text>
      </TouchableOpacity>
      <Modal visible={teacherModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.searchInput} placeholder="Search Teacher" onChangeText={handleTeacherSearch} />
            <FlatList
              data={filteredTeachers}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderItem({ item, searchQuery: teacherSearchQuery, setSelectedItem: setLessonTeacher, setModalVisible: setTeacherModalVisible })}
            />
            <TouchableOpacity style={[styles.roundButton, styles.cancelButton]} onPress={() => setTeacherModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Form Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setFormModalVisible(true)}>
        <Text>{lessonForm || 'Select Form'}</Text>
      </TouchableOpacity>
      <Modal visible={formModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.searchInput} placeholder="Search Form" onChangeText={handleFormSearch} />
            <FlatList
              data={filteredForms}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderItem({ item, searchQuery: formSearchQuery, setSelectedItem: setLessonForm, setModalVisible: setFormModalVisible })}
            />
            <TouchableOpacity style={[styles.roundButton, styles.cancelButton]} onPress={() => setFormModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
