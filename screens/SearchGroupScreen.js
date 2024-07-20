import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const SearchGroupScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const snapshot = await getDocs(collection(db, 'groups'));
      const loadedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(loadedGroups);
    };
  
    const fetchSchools = async () => {
      const snapshot = await getDocs(collection(db, 'schools'));
      const loadedSchools = 
      snapshot.docs.map(doc => ({ id: doc.id, name: doc.id, supervisorContact: doc.data().supervisorContact, supervisorName: doc.data().supervisorName }));
      setSchools(loadedSchools);
    };
  
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const loadedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(loadedUsers);
    };
  
    fetchGroups();
    fetchSchools();
    fetchUsers();
  }, []);
  

  const handleSearch = () => {
    const filteredGroups = groups.filter(group => group.groupName.toLowerCase().includes(searchText.toLowerCase()));
    setGroups(filteredGroups);
  };

  const handleDeleteGroup = async () => {
    await deleteDoc(doc(db, 'groups', selectedGroup.id));
    setGroups(groups.filter(group => group.id !== selectedGroup.id));
    setModalVisible(false);
    alert('Group deleted successfully!');
  };

  const toggleUserInGroup = (userId) => {
    const isUserInGroup = selectedGroup.users.includes(userId);
    const updatedUsers = isUserInGroup
      ? selectedGroup.users.filter(id => id !== userId)
      : [...selectedGroup.users, userId];
  
    setSelectedGroup(prev => ({ ...prev, users: updatedUsers }));
    console.log('Updated Users List:', updatedUsers); // Debug log to check user list
  };
  
  const handleSaveChanges = async () => {
    const groupRef = doc(db, 'groups', selectedGroup.id);
    
    // Construct the update payload, omitting undefined fields
    const updatePayload = {
      groupName: selectedGroup.groupName,
      className: selectedGroup.className || '', // Provide a default empty string if undefined
      users: selectedGroup.users // Ensuring 'users' array is updated
    };
  
    // Include school name directly as it acts as the identifier
    if (selectedGroup.schoolName) {
      updatePayload.schoolName = selectedGroup.schoolName;
    }
  
    try {
      await updateDoc(groupRef, updatePayload);
      setModalVisible(false);
      setEditMode(false);
      alert('Group updated successfully!');
      
      // Refetch groups to update UI
      const snapshot = await getDocs(collection(db, 'groups'));
      const loadedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(loadedGroups);
    } catch (error) {
      console.error('Failed to save group changes:', error);
      alert('Failed to save changes.');
    }
  };
  

  const handleChange = (field, value) => {
    setSelectedGroup({ ...selectedGroup, [field]: value });
  };

  const openEditMode = (group) => {
    setSelectedGroup({ ...group, users: group.users || [] });
    setEditMode(true);
    setModalVisible(true);
  };

  const openViewMode = (group) => {
    setSelectedGroup(group);
    setEditMode(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Groups by Name"
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} color={colors.yellow} />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openViewMode(item)}>
            <Text style={styles.item}>{item.groupName}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedGroup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {editMode ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={selectedGroup.groupName}
                    placeholder="Group Name"
                    onChangeText={(text) => handleChange('groupName', text)}
                  />
                  <TextInput
                    style={styles.input}
                    value={selectedGroup.className || ''}
                    placeholder="Class Name"
                    onChangeText={(text) => handleChange('className', text)}
                  />
                  <Text>School:</Text>
                  <Picker
                    selectedValue={selectedGroup.schoolId}
                    onValueChange={(itemValue, itemIndex) => handleChange('schoolId', itemValue)}
                    style={styles.input}
                  >
                    {schools.map(school => (
                      <Picker.Item label={school.name} value={school.id} key={school.id} />
                    ))}
                  </Picker>

                  <Text>Users:</Text>
                  {users.map(user => (
                    <TouchableOpacity key={user.id} onPress={() => toggleUserInGroup(user.id)}>
                      <Text style={[styles.userItem, selectedGroup.users.includes(user.id) && styles.selectedUser]}>
                        {user.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Button title="Save Changes" onPress={handleSaveChanges} color={colors.yellow} />
                </>
              ) : (
                <>
                  <Text style={styles.modalText}>Group Name: {selectedGroup.groupName}</Text>
                  <Text style={styles.modalText}>Class Name: {selectedGroup.className}</Text>
                  <Text style={styles.modalText}>School: {schools.find(school => school.id === selectedGroup.schoolId)?.name}</Text>
                  <Text style={styles.modalText}>Users:</Text>
                  {users.filter(user => selectedGroup.users.includes(user.id)).map(user => (
                    <Text key={user.id} style={styles.userItem}>{user.name}</Text>
                  ))}
                  <Button title="Edit" onPress={() => openEditMode(selectedGroup)} color={colors.purple} />
                  <Button title="Delete" onPress={handleDeleteGroup} color="#ff0000" />
                </>
              )}
              <Button title="Close" onPress={() => setModalVisible(false)} color={colors.purple} />
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.lightGrey,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.purple,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: colors.purple,
    backgroundColor: '#FFFFFF'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: colors.purple,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUser: {
    backgroundColor: colors.lightGrey,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default SearchGroupScreen;
