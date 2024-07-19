import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateSchoolScreen = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
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
      setSchools(loadedSchools.sort((a, b) => a.schoolName.localeCompare(b.schoolName)));
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
    const updatedSchools = schools.map((school) =>
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
    const filteredSchools = schools.filter((school) => school.id !== selectedSchool);

    try {
      await AsyncStorage.setItem('schools', JSON.stringify(filteredSchools));
      alert('School deleted successfully!');
      loadSchools(); // Reload schools to reflect the deletion
      setSelectedSchool(null);
      setSchoolName('');
      setSupervisorName('');
      setSupervisorContact('');
      setModalVisible(false);
    } catch (e) {
      console.error('Error deleting school:', e);
    }
  };

  const handleSearch = () => {
    const filtered = schools.filter((school) => school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()));
    setSchools(filtered.sort((a, b) => a.schoolName.localeCompare(b.schoolName)));
  };

  const renderSchoolItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSchoolSelect(item.id)} style={styles.schoolItem}>
      <Text>{item.schoolName}</Text>
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
      <Button title="Search" onPress={handleSearch} />
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
            <Button title="Update School" onPress={handleUpdateSchool} />
            <Button title="Delete School" onPress={handleDeleteSchool} color="red" />
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
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  schoolItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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

export default UpdateSchoolScreen;
