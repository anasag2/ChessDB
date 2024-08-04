import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([
    { id: '1', teachername: 'John Doe', groupname: 'Math' },
    { id: '2', teachername: 'Jane Smith', groupname: 'Science' },
    // Add more initial data as needed
  ]);

  const handleSearch = () => {
    // Implement your search logic here
    const filteredResults = results.filter(item =>
      item.teachername.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by teacher name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.teachername}</ListItem.Title>
              <ListItem.Subtitle>{item.groupname}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});

export default App;
