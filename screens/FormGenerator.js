import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FormGenerator = () => {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);
  const [newFieldType, setNewFieldType] = useState('text');

  const addField = () => {
    setFields([...fields, { type: newFieldType, label: '', value: '' }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const saveForm = () => {
    if (!formName.trim()) {
      Alert.alert('Form Name is required');
      return;
    }

    Alert.alert('Form Saved', JSON.stringify({ name: formName, fields: fields }));
    setFormName('');
    setFields([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Form Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Form Name"
        value={formName}
        onChangeText={setFormName}
      />
      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Field Label"
            value={field.label}
            onChangeText={(text) => handleFieldChange(index, 'label', text)}
          />
          <Picker
            selectedValue={field.type}
            style={styles.picker}
            onValueChange={(itemValue) =>
              handleFieldChange(index, 'type', itemValue)
            }
          >
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Number" value="number" />
            <Picker.Item label="Date" value="date" />
          </Picker>
          {field.type === 'text' && (
            <TextInput
              style={styles.input}
              placeholder="Enter text"
              value={field.value}
              onChangeText={(text) => handleFieldChange(index, 'value', text)}
            />
          )}
          {field.type === 'number' && (
            <TextInput
              style={styles.input}
              placeholder="Enter number"
              keyboardType="numeric"
              value={field.value}
              onChangeText={(text) => handleFieldChange(index, 'value', text)}
            />
          )}
          {field.type === 'date' && (
            <TextInput
              style={styles.input}
              placeholder="Enter date"
              value={field.value}
              onChangeText={(text) => handleFieldChange(index, 'value', text)}
            />
          )}
        </View>
      ))}
      <Picker
        selectedValue={newFieldType}
        style={styles.picker}
        onValueChange={(itemValue) => setNewFieldType(itemValue)}
      >
        <Picker.Item label="Text" value="text" />
        <Picker.Item label="Number" value="number" />
        <Picker.Item label="Date" value="date" />
      </Picker>
      <Button title="Add Field" onPress={addField} />
      <Button title="Save Form" onPress={saveForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
});

export default FormGenerator;
