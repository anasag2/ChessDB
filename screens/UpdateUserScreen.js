import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UpdateUserScreen = () => {
  const initialUsers = [
    { name: 'John Doe', email: 'john@example.com', id: '1', password: 'password1', role: 'admin' },
    { name: 'Jane Smith', email: 'jane@example.com', id: '2', password: 'password2', role: 'teacher' },
    { name: 'Mike Johnson', email: 'mike@example.com', id: '3', password: 'password3', role: 'teacher' },
    { name: 'Emily Davis', email: 'emily@example.com', id: '4', password: 'password4', role: 'admin' },
    { name: 'David Wilson', email: 'david@example.com', id: '5', password: 'password5', role: 'teacher' },
    { name: 'محمد محسن', email: 'mie@example.com', id: '6', password: 'password6', role: 'teacher' },
    { name: 'سمير حسكل', email: 'emly@example.com', id: '7', password: 'password7', role: 'admin' },
    { name: 'برق جايتو ', email: 'daid@example.com', id: '8', password: 'password8', role: 'teacher' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleSave = () => {
    setUsers(users.map(user => (user.id === editedUser.id ? editedUser : user)));
    setFilteredUsers(filteredUsers.map(user => (user.id === editedUser.id ? editedUser : user)));
    setSelectedUser(editedUser);
    setEditMode(false);
    setModalVisible(false); // Close modal after saving
    console.log('User Data:', JSON.stringify(editedUser));
  };

  const handleInputChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setModalVisible(true);
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
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{selectedUser.name}</Text>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{selectedUser.email}</Text>
                  <Text style={styles.label}>Password:</Text>
                  <Text style={styles.value}>{selectedUser.password}</Text>
                  <Text style={styles.label}>Role:</Text>
                  <Text style={styles.value}>{selectedUser.role}</Text>
                  <Button title="Edit" onPress={handleEdit} />
                </>
              )
            ) : (
              <Text>Loading...</Text>
            )}
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
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
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
});

export default UpdateUserScreen;
