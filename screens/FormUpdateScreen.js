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
import db from '../firebaseConfig.js';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

const UpdateFormScreen = () => {
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForms, setFilteredForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadForms = async () => {
      const formsSnapshot = await getDocs(collection(db, 'forms'));
      const formList = [];
      formsSnapshot.forEach((doc) => {
        formList.push({ id: doc.id, ...doc.data() });
      });
      formList.sort((a, b) => a.id.localeCompare(b.id));
      setForms(formList);
      setFilteredForms(formList);
    };

    loadForms();
  }, []);

  const handleSearch = () => {
    const filtered = forms.filter(form => form.id.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const handleFormPress = async (formId) => {
    try {
      const formRef = collection(db, formId);
      const formSnapshot = await getDocs(formRef);
      const userGroupList = [];

      for (const docSnap of formSnapshot.docs) {
        const data = docSnap.data();
        const groupRef = doc(db, 'groups', data.group);
        const groupSnap = await getDoc(groupRef);
        userGroupList.push({
          userName: data.userName,
          groupName: groupSnap.data().groupName
        });
      }

      setUserGroups(userGroupList);
      setSelectedForm(formId);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const renderForm = ({ item }) => (
    <TouchableOpacity onPress={() => handleFormPress(item.id)}>
      <View style={styles.formContainer}>
        {highlightText(item.id, searchQuery)}
      </View>
    </TouchableOpacity>
  );

  const renderUserGroup = ({ item }) => (
    <View style={styles.userGroupContainer}>
      <Text>{item.userName} -> {item.groupName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Forms"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredForms}
        keyExtractor={(item) => item.id}
        renderItem={renderForm}
        style={styles.list}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Teachers and Groups for {selectedForm}</Text>
            <FlatList
              data={userGroups}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderUserGroup}
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
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
  formContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  userGroupContainer: {
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
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateFormScreen;
