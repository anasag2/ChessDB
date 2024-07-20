import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../firebaseConfig.js';
import { getDoc, writeBatch, doc, collection, getDocs } from 'firebase/firestore';

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
  const data = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
  ];
  useEffect(() => {
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
  
  // const handleShowGroups = () => {

  // };
  // const handleShowForms = () => {

 
  // };

  const renderItem = ({ item }) => (
<TouchableOpacity onPress={() => openModal(item)}>
<View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
</TouchableOpacity>
  );


  const handleDelete = () => {
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
                    placeholder="place of residence"
                  />
                  <TextInput
                    style={styles.input}
                    value={editedUser.phone_number}
                    onChangeText={(text) => handleInputChange('phone_number', text)}
                    placeholder="phone number"
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
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={editedUser.role}
                      onValueChange={(itemValue) => handleInputChange('role', itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Admin" value="admin" />
                      <Picker.Item label="Teacher" value="teacher" />
                    </Picker>
                  </View>
                  <Button title="Save" onPress={handleSave} />
                </>
              ) : (
                <>
                <View style={styles.row}>
                  <Text style={styles.label}>Name: </Text>
                  <Text style={styles.value}>{selectedUser.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>gender: </Text>
                  <Text style={styles.value}>{selectedUser.gender}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>place of residence: </Text>
                  <Text style={styles.value}>{selectedUser.place_of_residence}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>phone number: </Text>
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
                  <Text style={styles.label}>number of groups: </Text>
                  <Text style={styles.value}>{selectedUser.groups.length}</Text>
                  <View style={styles.Show}>
                  <Button
        title={showList ? "Hide" : "Show"}
        onPress={() => setShowListF(!showList)}
      />
      {showList && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
                  </View>
                  
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>number of unfilled forms: </Text>
                  <Text style={styles.value}>{Object.keys(selectedUser.forms_to_fill).length}</Text>
                  <View style={styles.Show}>
                  <Button
        title={showListGroup ? "Hide" : "Show"}
        onPress={() => setShowListG(!showListGroup)}
      />
      {showListGroup && (
        <FlatList
          data={data}//change
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
                  </View>
                  
                </View>
                <View style={styles.Close}>
                  <Button title="Edit" onPress={handleEdit} style={styles.Edit}/>
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    marginBottom:50,
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

export default UpdateUserScreen;
