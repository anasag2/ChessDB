import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, CheckBox } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const SearchGroupScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      const snapshot = await getDocs(collection(db, 'groups'));
      const loadedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(loadedGroups);
    };

    const fetchSchools = async () => {
      const snapshot = await getDocs(collection(db, 'schools'));
      const loadedSchools = snapshot.docs.map(doc => ({ name: doc.id }));
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

  const handleSaveChanges = async () => {
    const groupRef = doc(db, 'groups', selectedGroup.id);
    await updateDoc(groupRef, selectedGroup);
    setModalVisible(false);
    alert('Group updated successfully!');
  };

  const handleChange = (field, value) => {
    setSelectedGroup({ ...selectedGroup, [field]: value });
  };

  const handleUserToggle = (userId) => {
    const updatedUsers = selectedGroup.users?.includes(userId)
      ? selectedGroup.users.filter(id => id !== userId)
      : [...(selectedGroup.users || []), userId];
    setSelectedGroup({ ...selectedGroup, users: updatedUsers });
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        setSelectedGroup({ ...item, users: item.users || [] });
        setModalVisible(true);
      }}
    >
      <Text style={styles.item}>{item.groupName}</Text>
    </TouchableOpacity>
  );

  const renderUser = ({ item }) => (
    <View key={item.id} style={styles.checkboxContainer}>
      <Text>{item.name}</Text>
      <CheckBox
        value={selectedGroup?.users?.includes(item.id)}
        onValueChange={() => handleUserToggle(item.id)}
      />
    </View>
  );

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
        renderItem={renderGroup}
      />
      {selectedGroup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalView}>
            {editMode ? (
              <>
                <TextInput
                  style={styles.input}
                  value={selectedGroup.groupName}
                  onChangeText={(text) => handleChange('groupName', text)}
                  placeholder="Group Name"
                />
                <TextInput
                  style={styles.input}
                  value={selectedGroup.className}
                  onChangeText={(text) => handleChange('className', text)}
                  placeholder="Class Name"
                />
                <Picker
                  selectedValue={selectedGroup.schoolId}
                  onValueChange={(itemValue) => handleChange('schoolId', itemValue)}
                  style={styles.input}
                >
                  {schools.map(school => (
                    <Picker.Item label={school.name} value={school.name} key={school.name} />
                  ))}
                </Picker>
                <Text style={styles.label}>Users:</Text>
                {users.map(renderUser)}
                <Button title="Save Changes" onPress={handleSaveChanges} color={colors.yellow} />
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Group Name: {selectedGroup.groupName}</Text>
                <Text style={styles.modalText}>Class Name: {selectedGroup.className}</Text>
                <Text style={styles.modalText}>
                  School: {schools.find(school => school.name === selectedGroup.schoolId)?.name || 'Unknown'}
                </Text>
                <Text style={styles.modalText}>Users:</Text>
                {selectedGroup.users.map(userId => {
                  const user = users.find(u => u.id === userId);
                  return <Text key={userId}>{user ? user.name : 'Unknown user'}</Text>;
                })}
                <Button title="Edit" onPress={() => setEditMode(true)} color={colors.purple} />
                <Button title="Delete" onPress={handleDeleteGroup} color="#ff0000" />
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} color={colors.purple} />
          </ScrollView>
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
    flexGrow: 1,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.purple,
  },
});

export default SearchGroupScreen;
