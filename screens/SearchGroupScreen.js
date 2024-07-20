import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import db from '../firebaseConfig.js';
import { doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const SearchGroupScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      const snapshot = await getDocs(collection(db, 'groups'));
      const loadedGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(loadedGroups);
    };
    fetchGroups();
  }, []);

  const handleSearch = async () => {
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
          <TouchableOpacity onPress={() => {
            setSelectedGroup(item);
            setModalVisible(true);
          }}>
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
            {editMode ? (
              <>
                <TextInput
                  style={styles.input}
                  value={selectedGroup.groupName}
                  onChangeText={(text) => handleChange('groupName', text)}
                />
                <Button title="Save Changes" onPress={handleSaveChanges} color={colors.yellow} />
              </>
            ) : (
              <>
                <Text style={styles.modalText}>Group Name: {selectedGroup.groupName}</Text>
                <Button title="Edit" onPress={() => setEditMode(true)} color={colors.purple} />
                <Button title="Delete" onPress={handleDeleteGroup} color="#ff0000" />
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} color={colors.purple} />
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
  }
});

export default SearchGroupScreen;
