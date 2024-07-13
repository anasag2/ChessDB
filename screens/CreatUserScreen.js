import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, Button, StyleSheet, Picker } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton'; 

const CreateUserScreen = () => {
  const navigation = useNavigation();
  const initialFormData = {
    id: '',
    name: '',
    place_of_residence: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'male',
    role: 'teacher',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic here
    console.log("Save data", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(formData).map((field) => (
        <View key={field} style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            placeholder={`Enter ${field}`}
            secureTextEntry={field === 'password'}
            keyboardType={field === 'id' ? 'number-pad' : 'default'}
          />
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
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
});

export default CreateUserScreen;
