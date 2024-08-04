import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal ,alert} from 'react-native';
import db from '../firebaseConfig.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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
      const schoolsRef = collection(db, 'schools');
      const schoolsSnapshot = await getDocs(schoolsRef);
      const loadedSchools = schoolsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOriginalSchools(loadedSchools);
      setSchools(loadedSchools);
    } catch (e) {
      alert('Error loading schools:', e);
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
    if (supervisorContact !== "" || supervisorName !== "") {
      try {
        const batch = writeBatch(db);
        const schoolDoc = doc(db, 'schools', selectedSchool);
        batch.update(schoolDoc, { supervisorContact, supervisorName });
        await batch.commit();
        loadSchools(); // Reload schools to reflect the update
        setModalVisible(false);
        alert('School updated successfully!');
      } catch (e) {
        alert('Error updating school:', e);
      }
    } else {
      alert("You have an empty label");
    }
  };

  const handleDeleteSchool = async () => {
    try {
      const schoolDoc = doc(db, 'schools', selectedSchool);
      await deleteDoc(schoolDoc);
      const batch = writeBatch(db);
      const groupsRef = collection(db, 'groups');
      const groupsSnapshot = await getDocs(groupsRef);
      groupsSnapshot.forEach((doc1) => {
        if (selectedSchool === doc1.data().school) {
          batch.update(doc(groupsRef, doc1.id), { school: '' });
        }
      });
      await batch.commit();
      loadSchools(); // Reload schools to reflect the deletion
      setModalVisible(false);
      setSelectedSchool('');
      setSchoolName('');
      setSupervisorName('');
      setSupervisorContact('');
      alert('School deleted successfully!');
    } catch (e) {
      alert('Error deleting school:', e);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSchools(originalSchools);
    } else {
      const filtered = originalSchools.filter((school) =>
        school.id && school.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSchools(filtered.sort((a, b) => a.id.localeCompare(b.id)));
    }
  };

  const highlightText = (text = '', highlight) => {
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
      {highlightText(item.id || 'Undefined', searchQuery)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search School</Text>
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

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F',
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
    backgroundColor: colors.purple, // Blue color
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
