import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
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
import BackButton from '../components/BackButton';
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
      if (formName == doc.id) {
        form = doc;
      }
    });
    if (form == undefined) {
      formQuestions = {};
      let empty = false;
      fields.forEach((field) => {
        if (field['label'] == '') {
          empty = true;
        }
      });
      if (empty == true) {
        alert('you have an empty field');
      } else {
        fields.forEach((field) => {
          formQuestions[field.label] = field.type;
        });
        await setDoc(doc(db, 'forms', formName), {
          questions: formQuestions,
        });
        Alert.alert('Form Saved');
        const newDocRef = doc(collection(db, formName));
        await setDoc(newDocRef, {});
        setFormName('');
        setFields([]);
      }
    } else {
      alert('this form already exists');
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
            <Picker.Item label="List" value="list" />
            <Picker.Item label="Map" value="map" />
          </Picker>
        </View>
      </View>
    </Modal>
  );

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
              <Picker.Item label="List" value="list" />
              <Picker.Item label="Map" value="map" />
            </Picker>
          )}
        </View>
      ))}
      <View style={styles.fieldControls}>
        <Text style={styles.label}>Add New Field:</Text>
        <TouchableOpacity style={styles.addButton} onPress={addField}>
          <Text style={styles.addButtonText}>Add Field</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveForm}>
        <Text style={styles.saveButtonText}>Save Form</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
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
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  fieldControls: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  pickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
    borderRadius: 8,
    padding: 20,
  },
});

export default FormGenerator;
