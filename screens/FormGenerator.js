import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
//import BackButton from '../components/BackButton';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const FormGenerator = () => {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);
  const [newFieldType, setNewFieldType] = useState('text');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerIndex, setDatePickerIndex] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const navigation = useNavigation();

  const addField = () => {
    setFields([...fields, { type: newFieldType, label: '' }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      handleFieldChange(datePickerIndex, 'value', selectedDate.toDateString());
    }
  };

  const saveToDB = async () => {
    let form = undefined;
    const forms = await getDocs(collection(db, 'forms'));
    forms.forEach((doc) => {
      if (formName === doc.id) {
        form = doc;
      }
    });
    if (!form) {
      const formQuestions = {};
      let empty = false;
      fields.forEach((field) => {
        if (field.label === '') {
          empty = true;
        }
      });
      if (empty) {
        Alert.alert('You have an empty field');
      } else {
        fields.forEach((field) => {
          formQuestions[field.label] = field.type;
        });
        await setDoc(doc(db, 'forms', formName), {
          questions: formQuestions,
        });
        Alert.alert('Form Saved');
        setFormName('');
        setFields([]);
      }
    } else {
      Alert.alert('This form already exists');
    }
  };

  const saveForm = () => {
    if (!formName.trim()) {
      Alert.alert('Form Name is required');
      return;
    }
    saveToDB();
  };

  const showPicker = (index) => {
    setSelectedFieldIndex(index);
    setPickerVisible(true);
  };

  const renderPicker = () => (
    <Modal visible={pickerVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Picker
            selectedValue={fields[selectedFieldIndex]?.type}
            onValueChange={(itemValue) => {
              handleFieldChange(selectedFieldIndex, 'type', itemValue);
              setPickerVisible(false);
            }}
          >
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Number" value="number" />
            <Picker.Item label="Date" value="date" />
            <Picker.Item label="students list" value="students" />
          </Picker>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => showPicker(index)}
              >
                <Text style={styles.pickerButtonText}>{field.type}</Text>
              </TouchableOpacity>
            ) : (
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
                <Picker.Item label="students list" value="students" />
              </Picker>
            )}
          </View>
        ))}
        <View style={styles.fieldControls}>
          <TouchableOpacity style={[styles.roundButton, styles.addButton]} onPress={addField}>
            <Text style={styles.buttonText}>Add Field</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.roundButton, styles.saveButton]} onPress={saveForm}>
          <Text style={styles.buttonText}>Save Form</Text>
        </TouchableOpacity>
        {datePickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {renderPicker()}
      </View>
    </ScrollView>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.purple,
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  fieldContainer: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#2196F3', // Green color
  },
  saveButton: {
    backgroundColor: colors.purple, // Blue color
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  roundButton: {
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default FormGenerator;
