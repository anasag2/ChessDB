import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateSchoolScreen = () => {
  const [originalSchools, setOriginalSchools] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorContact, setSupervisorContact] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('schools');
      const loadedSchools = jsonValue != null ? JSON.parse(jsonValue) : [];
      const sortedSchools = loadedSchools.sort((a, b) => a.schoolName.localeCompare(b.schoolName));
      setOriginalSchools(sortedSchools);
      setSchools(sortedSchools);
    } catch (e) {
      console.error('Error loading schools:', e);
    }
  };

  const handleSchoolSelect = (schoolId) => {
    const school = schools.find((school) => school.id === schoolId);
    setSelectedSchool(schoolId);
    setSchoolName(school.schoolName);
    setSupervisorName(school.supervisorName);
    setSupervisorContact(school.supervisorContact);
    setModalVisible(true);
  };

  const handleUpdateSchool = async () => {
    const updatedSchools = originalSchools.map((school) =>
      school.id === selectedSchool
        ? { ...school, schoolName, supervisorName, supervisorContact }
        : school
    );

    try {
      await AsyncStorage.setItem('schools', JSON.stringify(updatedSchools));
      alert('School updated successfully!');
      loadSchools(); // Reload schools to reflect the update
      setModalVisible(false);
    } catch (e) {
      console.error('Error updating school:', e);
    }
  };

  const handleDeleteSchool = async () => {
    const filteredSchools = originalSchools.filter((school) => school.id !== selectedSchool);

    try {
      await AsyncStorage.setItem('schools', JSON.stringify(filteredSchools));
      alert('School deleted successfully!');
      loadSchools(); // Reload schools to reflect the deletion
      setModalVisible(false);
      setSelectedSchool('');
      setSchoolName('');
      setSupervisorName('');
      setSupervisorContact('');
    } catch (e) {
      console.error('Error deleting school:', e);
    }
  };

  const handleSearch = () => {
    const filtered = originalSchools.filter((school) =>
      school.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSchools(filtered.sort((a, b) => a.schoolName.localeCompare(b.schoolName)));
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

  const renderSchoolItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSchoolSelect(item.id)} style={styles.schoolItem}>
      {highlightText(item.schoolName, searchQuery)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update School</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Schools"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={schools}
        keyExtractor={(item) => item.id}
        renderItem={renderSchoolItem}
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
            <TouchableOpacity style={[styles.roundButton, styles.updateButton]} onPress={handleUpdateSchool}>
              <Text style={styles.buttonText}>Update School</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roundButton, styles.deleteButton]} onPress={handleDeleteSchool}>
              <Text style={styles.buttonText}>Delete School</Text>
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
  list: {
    marginBottom: 20,
  },
  schoolItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
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
    borderRadius: 20,
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: '#2196F3', // Blue color
  },
  updateButton: {
    backgroundColor: '#2199F9', // Blue color
  },
  deleteButton: {
    backgroundColor: 'red', // Red color
  },
  closeButton: {
    backgroundColor: '#777', // Gray color
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateSchoolScreen;
