import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const formData = [
    {
      id: '1',
      question: 'الاسم؟',
      type: 'text',
    },
    {
      id: '2',
      question: 'العمر؟',
      type: 'number',
    },
    {
      id: '3',
      question: 'تاريخ الولادة؟',
      type: 'date',
    },
    {
      id: '4',
      question: 'شو وظيفتك بالحياة؟',
      type: 'list',
      options: ['مدرب', 'مسؤول', 'معلم'],
    },
  ];
  

const FormBuilderScreen = () => {
  const [formValues, setFormValues] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);

  const handleInputChange = (id, value) => {
    setFormValues({ ...formValues, [id]: value });
  };

  const handleDateChange = (event, selectedDate, id) => {
    setShowDatePicker(null);
    handleInputChange(id, selectedDate.toISOString().split('T')[0]);
  };

  const handleSubmit = () => {
    const responses = formData.map(question => ({
      question: question.question,
      answer: formValues[question.id] || '',
    }));
    console.log('User Responses:', responses);
    Alert.alert('Form Submitted', JSON.stringify(responses, null, 2));
    // Reset form values
    setFormValues({});
  };

  return (
    <ScrollView style={styles.container}>
      {formData.map((question) => (
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

export default FormBuilderScreen;
