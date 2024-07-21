import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  Pressable 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../firebaseConfig.js';
import { doc, deleteDoc, updateDoc, collection, getDocs, getDoc } from 'firebase/firestore';

const SearchGroupScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState([]);
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsSnapshot = await getDocs(collection(db, 'groups'));
        const loadedGroups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(loadedGroups);

        const schoolsSnapshot = await getDocs(collection(db, 'schools'));
        const loadedSchools = schoolsSnapshot.docs.map(doc => ({ name: doc.id }));
        setSchools(loadedSchools);

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const loadedUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredGroups = groups.filter(group => 
      group.groupName.toLowerCase().includes(searchText.toLowerCase())
    );
    setGroups(filteredGroups);
  };

  const handleDeleteGroup = async () => {
    if (selectedGroup) {
      await deleteDoc(doc(db, 'groups', selectedGroup.id));
      setGroups(groups.filter(group => group.id !== selectedGroup.id));
      setModalVisible(false);
      setSelectedGroup(null);
      alert('Group deleted successfully!');
    }
  };

  const handleSaveChanges = async () => {
    if (selectedGroup) {
      try {
        const groupRef = doc(db, 'groups', selectedGroup.id);
        await updateDoc(groupRef, {
          groupName: selectedGroup.groupName,
          class: selectedGroup.class,
          school: selectedGroup.school,
          teachers: selectedGroup.teachers
        });
        
        // Update the groups state with the new data
        setGroups(prevGroups => prevGroups.map(group =>
          group.id === selectedGroup.id ? { ...group, ...selectedGroup } : group
        ));
        
        setModalVisible(false);
        setEditMode(false);
        alert('Group updated successfully!');
      } catch (error) {
        console.error("Error updating group:", error);
        alert('Failed to update group. Please try again.');
      }
    }
  };
  
  const handleChange = (field, value) => {
    setSelectedGroup(prevGroup => ({ ...prevGroup, [field]: value }));
  };
  
  const handleUserToggle = async (userId) => {
    setSelectedGroup(prevGroup => {
      // Determine if the user is already a member of the group
      const isMember = prevGroup.teachers.includes(userId);
      const updatedTeachers = isMember
        ? prevGroup.teachers.filter(id => id !== userId)
        : [...prevGroup.teachers, userId];
      
      // Update the group in Firestore
      const groupRef = doc(db, 'groups', prevGroup.id);
      updateDoc(groupRef, {
        teachers: updatedTeachers
      }).then(() => {
        console.log("Group updated successfully.");
      }).catch(error => {
        console.error("Error updating group:", error);
      });
  
      // Optionally update the user document in Firestore
      // This part assumes users have a 'groups' field listing their group memberships
      const userRef = doc(db, 'users', userId);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists()) {
          const userGroups = docSnap.data().groups || [];
          const updatedUserGroups = isMember
            ? userGroups.filter(g => g !== prevGroup.id)
            : [...userGroups, prevGroup.id];
          
          updateDoc(userRef, {
            groups: updatedUserGroups
          }).then(() => {
            console.log("User updated successfully.");
          }).catch(error => {
            console.error("Error updating user groups:", error);
          });
        }
      });
  
      return { ...prevGroup, teachers: updatedTeachers };
    });
  };
  
  
  const handleEditGroup = (group) => {
    setSelectedGroup({
      ...group,
      teachers: group.teachers || [],
      school: group.school || '',
      class: group.class || '',
    });
    setEditMode(true);
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedGroup(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.item}>{item.groupName}</Text>
    </TouchableOpacity>
  );

  const renderUser = ({ item }) => (
    <View style={styles.checkboxContainer}>
      <Text>{item.name || 'Unknown User'}</Text>
      <Pressable
        style={[
          styles.checkbox,
          selectedGroup?.teachers?.includes(item.id) && styles.checkboxChecked
        ]}
        onPress={() => handleUserToggle(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Groups by Name"
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
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
          <View style={styles.modalView}>
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
                  value={selectedGroup.class}
                  onChangeText={(text) => handleChange('class', text)}
                  placeholder="Class Name"
                />
                <Picker
                  selectedValue={selectedGroup.school}
                  onValueChange={(itemValue) => handleChange('school', itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Select a school" value="" />
                  {schools.map(school => (
                    <Picker.Item label={school.name} value={school.name} key={school.name} />
                  ))}
                </Picker>
                <Text style={styles.label}>Users:</Text>
                  {users.map(user => (
                    <View key={user.id} style={styles.checkboxContainer}>
                      <Text>{user.name || 'Unknown User'}</Text>
                      <Pressable
                        style={[
                          styles.checkbox,
                          selectedGroup.teachers?.includes(user.id) && styles.checkboxChecked
                        ]}
                        onPress={() => handleUserToggle(user.id)}
                      />
                    </View>
                  ))}
                  <Button title="Save Changes" onPress={handleSaveChanges} color={colors.yellow} />
                </>
              ) : (
              <>
                <Text style={styles.modalText}>Group Name: {selectedGroup.groupName}</Text>
                <Text style={styles.modalText}>Class Name: {selectedGroup.class || 'N/A'}</Text>
                <Text style={styles.modalText}>School: {selectedGroup.school || 'Unknown'}</Text>
                <Text style={styles.modalText}>Users:</Text>
                {selectedGroup.teachers?.map(userId => {
                const user = users.find(u => u.id === userId);
                return <Text key={userId}>{user ? user.name : 'Unknown user'}</Text>;
              })}
              <Button title="Edit" onPress={() => handleEditGroup(selectedGroup)} color={colors.purple} />
              <Button title="Delete" onPress={handleDeleteGroup} color="#ff0000" />
            </>
          )}
          <Button title="Close" onPress={() => {
            setModalVisible(false);
            setEditMode(false);
          }} color={colors.purple} />
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
    elevation: 5,
    maxHeight: '80%',  // Limit the height of the modal
    overflow: 'scroll' // Make the content scrollable if it exceeds the height
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.purple, //purple color
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.purple,
    borderRadius: 4,
    marginLeft: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.purple,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.purple,
  },
});

export default SearchGroupScreen;