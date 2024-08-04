import React, { useState, useEffect } from 'react';
import {Alert,  View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../firebaseConfig.js';
import { getDoc, writeBatch, doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const UpdateUserScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showList, setShowListF] = useState(false);
  const [showListGroup, setShowListG] = useState(false);
  const [groups, setGroups] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const u = await getDocs(collection(db, 'users'));
    const userList = [];
    u.forEach((doc) => {
      let user_infos = {
        id: doc.id,
        name: doc.data().name,
        place_of_residence: doc.data().place_of_residence,
        role: doc.data().role,
        gender: doc.data().gender,
        email: doc.data().email,
        password: doc.data().password,
        phone_number: doc.data().phone_number,
        groups: doc.data().groups,
        forms_to_fill: doc.data().forms_to_fill,
      };
      userList.push(user_infos);
    });
    userList.sort((a, b) => a.name.localeCompare(b.name));
    setUsers(userList);
    setFilteredUsers(userList);
  };


  const handleSearch = () => {
    const filtered = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredUsers(filtered);
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

  const handleEdit = () => {
    setEditMode(true);
    setEditedUser({ ...selectedUser });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.item}>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleDelete = async() => {
    const lessonRef = doc(db, 'users', selectedUser.id);
    await deleteDoc(lessonRef);
    Alert.alert('user deleted successfully!');
    setModalVisible(false);
    loadUsers();
  };

  const emailValidation = () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+(@gmail\.com)$/;
    return gmailRegex.test(editedUser.email);
  };

  const passwordValidation = () => {
    const p = editedUser.password;
    let numCounter = 0;
    if (p.length === 0 || p.length < 8) {
      return false;
    }
    for (let char of p) {
      let charCode = char.charCodeAt(0);
      if (charCode >= 48 && charCode <= 57) {
        numCounter += 1;
      }
    }
    return numCounter >= 3;
  };

  const handleSave = async () => {
    if (!emailValidation()) {
      alert("Unsupported email");
    } else if (!passwordValidation()) {
      alert("You have entered an invalid password\nPassword should be made up of at least 3 numbers and 5 letters");
    } else {
      const updatedUsers = users.map(user => (user.id === editedUser.id ? editedUser : user));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectedUser(editedUser);
      const batch = writeBatch(db);
      const userRef = doc(db, "users", editedUser.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      for (let [key, value] of Object.entries(editedUser)) {
        if (key !== 'id' && value !== userData[key]) {
          batch.update(userRef, { [key]: value });
        }
      }
      setEditMode(false);
      setModalVisible(false); // Close modal after saving
      await batch.commit();
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const openModal = (user) => {
    setShowListF(false);
    setShowListG(false);
    setSelectedUser(user);
    setEditedUser(user);
    setModalVisible(true);
    setEditMode(false);
  };

  const showGroups = async () => {
    if (selectedUser) {
      const userRef = doc(db, "users", selectedUser.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const groupDataPromises = userData.groups.map(async (groupId) => {
        const groupRef = doc(db, "groups", groupId);
        const groupSnap = await getDoc(groupRef);
        return { id: groupId, name: groupSnap.data().groupName };
      });
      const groupData = await Promise.all(groupDataPromises);
      setGroups(groupData);
      setShowListF(!showList);
    }
  };

  const showForms = async () => {
    if (selectedUser) {
      const userRef = doc(db, "users", selectedUser.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const forms_to_fill = userData.forms_to_fill;
      const formsMap = new Map(Object.entries(forms_to_fill));
      let count = 1;
      let z = [];
      const groupsRef = collection(db, "groups");
      for (const [key, value] of formsMap.entries()) {
        const groupRef = doc(groupsRef, key);
        const group = await getDoc(groupRef);
        z.push({ id: count++, name: `${value} for group ${group.data().groupName}` });
      }
      setForms(z);
      setShowListG(!showListGroup); // Toggle visibility
    }
  };
  


  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.userContainer}>
        {highlightText(item.name, searchQuery)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update User</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
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
            {selectedUser && editedUser ? (
              editMode ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editedUser.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    placeholder="Name"
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.place_of_residence}
                    onChangeText={(text) => handleInputChange('place_of_residence', text)}
                    placeholder="Place of Residence"
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.phone_number}
                    onChangeText={(text) => handleInputChange('phone_number', text)}
                    placeholder="Phone Number"
                    keyboardType='number-pad'
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Email"
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    placeholder="Password"
                    secureTextEntry
                  />
                  {/* {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => showPicker(index)}
                    >
                      <Text style={styles.pickerButtonText}>{editedUser.role}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={editedUser.role}
                      style={styles.picker}
                      onValueChange={(itemValue) => handleInputChange('role', itemValue)}
                    >
                      <Picker.Item label="Admin" value="admin" />
                      <Picker.Item label="Teacher" value="teacher" />
                    </Picker>
                  )} */}
                  <Button title="Save" onPress={handleSave} />
                </>
              ) : (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Name: </Text>
                    <Text style={styles.value}>{selectedUser.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Gender: </Text>
                    <Text style={styles.value}>{selectedUser.gender}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Place of Residence: </Text>
                    <Text style={styles.value}>{selectedUser.place_of_residence}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Phone Number: </Text>
                    <Text style={styles.value}>{selectedUser.phone_number}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Email: </Text>
                    <Text style={styles.value}>{selectedUser.email}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Password: </Text>
                    <Text style={styles.value}>{selectedUser.password}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Role: </Text>
                    <Text style={styles.value}>{selectedUser.role}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Number of Groups: </Text>
                    <Text style={styles.value}>{selectedUser.groups.length}</Text>
                  </View>
                  <View style={styles.Show}>
                    <Button color={'red'}
                      title={showList ? "Hide" : "Show"}
                      onPress={showGroups}
                    />
                    {showList && (
                      <FlatList
                        data={groups}
                        renderItem={({ item }) => (
                          <View style={styles.item}>
                            <Text>{item.name}</Text>
                          </View>
                        )}
                        keyExtractor={item => item.id}
                        nestedScrollEnabled={true}
                        style={styles.list}
                      />
                    )}
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Number of Unfilled Forms: </Text>
                    <Text style={styles.value}>{Object.keys(selectedUser.forms_to_fill).length}</Text>
                  </View>
                  <View style={styles.Show}>
                    <Button color={'red'}
                      title={showListGroup ? "Hide" : "Show"}
                      onPress={showForms}
                    />
                    {showListGroup && (
                      <FlatList
                        data={forms}
                        renderItem={({ item }) => (
                          <View style={styles.item}>
                            <Text>{item.name}</Text>
                          </View>
                        )}
                        keyExtractor={item => item.id}
                        nestedScrollEnabled={true}
                        style={styles.list}
                      />
                    )}
                  </View>
                  <View style={styles.Close}>
                    <Button title="Edit" onPress={handleEdit} style={styles.Edit} />
                  </View>
                </>
              )
            ) : (
              <Text>Loading...</Text>
            )}
            <View style={styles.Close}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
            <View style={styles.Close}>
              <Button title="Delete" onPress={handleDelete} />
            </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.purple,
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 50,
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userContainer: {
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  Close: {
    marginTop: 10,
  },
  Edit: {
    marginTop: 10,
  },
  Show: {
    marginTop: 10,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UpdateUserScreen;
