import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../firebaseConfig.js';
import { getDoc, writeBatch, doc, collection, getDocs } from 'firebase/firestore';

const FormUpdateScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const u = await getDocs(collection(db, 'forms'));
      const userList = [];
      u.forEach((doc) => {
        let user_infos = {
          name: doc.id,
          question: doc.data().questions, 
        };
        userList.push(user_infos);
      });
      userList.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(userList);
      setFilteredUsers(userList);
    };

    loadUsers();
  }, []);

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
  
  const emailValidation = () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+(@gmail\.com)$/;
    return gmailRegex.test(editedUser.email);
  };

  const passwordValidation = () => {
    p = editedUser.password;
    numCounter = 0;
    if(p.length === 0 || p.length < 8){
      return false;
    }
    for (let char of p) {
      let charCode = char.charCodeAt(0);
      if(charCode >= 48 && charCode <= 57){
        numCounter += 1;
      }
    }
    if(numCounter < 3){
       return false;
    }
    return true;
  };

  const handleSave = async () => {
    if(emailValidation() === false){
      alert("unsupported email");
    }else{
      if(passwordValidation() === false){
        alert("you have entered an invalid password\npassword should be made up of 3 numbers annd 5 letters at least");
      }else{
        const updatedUsers = users.map(user => (user.id === editedUser.id ? editedUser : user));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setSelectedUser(editedUser);
        const batch = writeBatch(db);
        const userRef = doc(db, "users", editedUser.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        for (let [key, value] of Object.entries(editedUser)) {
          if(key !== 'id'){
            if (value !== userData[key]){
              //console.log([key]);
              batch.update(userRef, {[key]: value});
            }
          }
        };
        setEditMode(false);
        setModalVisible(false); // Close modal after saving
        //console.log('User Data:', JSON.stringify(editedUser));
        await batch.commit();
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setModalVisible(true);
    setEditMode(false);
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
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.name}
        renderItem={renderUser}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom:50,
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
  Close:{
    marginTop: 10,
  },
  Edit:{
    marginTop: 10,
  },
  Show:{
    marginLeft: 10,
  },
  
});

export default FormUpdateScreen;
