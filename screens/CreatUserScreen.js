import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CreateUserScreen = () => {
  const initialFormData = {
    name: '',
    email: '',
    id: '',
    password: '',
    role: 'admin',
  };

  const initialEditingState = {
    name: true,
    email: true,
    id: true,
    password: true,
    role: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(initialEditingState);

  const handleConfirm = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('User Data:', JSON.stringify(formData));
    // Reset formData and isEditing states
    setFormData(initialFormData);
    setIsEditing(initialEditingState);
  };

  return (
    <View style={styles.container}>
      {Object.keys(formData).map((field) => (
        <View key={field} style={styles.fieldContainer}>
          {isEditing[field] ? (
            field !== 'role' ? (
              <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter ${field}`}
                secureTextEntry={field === 'password'}
              />
            ) : (
              <Picker
                selectedValue={formData[field]}
                style={styles.input}
                onValueChange={(itemValue) => handleChange(field, itemValue)}
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Teacher" value="teacher" />
              </Picker>
            )
          ) : (
            <Text style={styles.label}>{formData[field]}</Text>
          )}
          {isEditing[field] ? (
            <Button title="Confirm" onPress={() => handleConfirm(field)} />
          ) : (
            <Button title="Edit" onPress={() => handleEdit(field)} />
          )}
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  label: {
    padding: 10,
    fontSize: 16,
  },
});

export default CreateUserScreen;
