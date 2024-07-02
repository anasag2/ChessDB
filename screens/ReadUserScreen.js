import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ReadUserScreen = () => {
  const users = [
    { name: 'John Doe', email: 'john@example.com', id: '1', password: 'password1', role: 'admin' },
    { name: 'Jane Smith', email: 'jane@example.com', id: '2', password: 'password2', role: 'teacher' },
    { name: 'Mike Johnson', email: 'mike@example.com', id: '3', password: 'password3', role: 'teacher' },
    { name: 'Emily Davis', email: 'emily@example.com', id: '4', password: 'password4', role: 'admin' },
    { name: 'David Wilson', email: 'david@example.com', id: '5', password: 'password5', role: 'teacher' },
    { name: 'محمد محسن', email: 'mie@example.com', id: '6', password: 'password6', role: 'teacher' },
    { name: 'سمير حسكل', email: 'emly@example.com', id: '7', password: 'password7', role: 'admin' },
    { name: 'برق جايتو ', email: 'daid@example.com', id: '8', password: 'password8', role: 'teacher' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedUser(item)}>
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
      {selectedUser && (
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{selectedUser.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{selectedUser.email}</Text>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{selectedUser.id}</Text>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{selectedUser.role}</Text>
        </View>
      )}
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
  detailContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
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
});

export default ReadUserScreen;
