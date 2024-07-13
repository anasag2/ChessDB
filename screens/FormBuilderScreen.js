import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'; 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const FormScreen = () => {
  const route = useRoute();
  const { form, markAsCompleted } = route.params;
  const [formValues, setFormValues] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);
  const navigation = useNavigation();



  const handleInputChange = (id, value) => {
    setFormValues({ ...formValues, [id]: value });
  };

  const handleDateChange = (event, selectedDate, id) => {
    setShowDatePicker(null);
    handleInputChange(id, selectedDate.toISOString().split('T')[0]);
  };

  const handleSubmit = () => {
    const responses = form.data.map(question => ({
      question: question.question,
      answer: formValues[question.id] || '',
    }));
    console.log('User Responses:', responses);
    Alert.alert('Form Submitted', JSON.stringify(responses, null, 2));
    markAsCompleted(form.name);
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      {form.data.map((question) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.type === 'text' && (
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleInputChange(question.id, text)}
              value={formValues[question.id] || ''}
            />
          )}
          {question.type === 'number' && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange(question.id, text)}
              value={formValues[question.id] || ''}
            />
          )}
          {question.type === 'date' && (
            <>
              <Button
                title={formValues[question.id] || 'Select Date'}
                onPress={() => setShowDatePicker(question.id)}
              />
              {showDatePicker === question.id && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange(event, selectedDate, question.id)}
                />
              )}
            </>
          )}
          {question.type === 'list' && (
            <Picker
              selectedValue={formValues[question.id]}
              onValueChange={(value) => handleInputChange(question.id, value)}
              style={styles.picker}
            >
              {question.options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          )}
        </View>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default FormScreen;
