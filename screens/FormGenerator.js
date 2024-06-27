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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import db from '../firebaseConfig.js';
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore"; 

const FormGenerator = () => {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([]);
  const [newFieldType, setNewFieldType] = useState('text');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerIndex, setDatePickerIndex] = useState(null);
  const navigation = useNavigation();

  const addField = () => {
    setFields([...fields, { type: newFieldType, label: ''}]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  // const showDatePicker = (index) => {
  //   setDatePickerIndex(index);
  //   setDatePickerVisible(true);
  // };

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      handleFieldChange(datePickerIndex, 'value', selectedDate.toDateString());
    }
  };

  const saveToDB = async() =>{
    let form = undefined;
    const forms = await getDocs(collection(db, "forms"));
    forms.forEach((doc) => {
      if(formName==doc.id){
        form = doc;
      };
    });
    if (form == undefined){
      formQuestions = {};
      let empty = false;
      fields.forEach((field)=>{
        if(field["label"] == ""){
          empty = true;
        };
      });
      if(empty == true){
        alert("you have an empty field");
      }
      else{
        fields.forEach((field)=>{
            formQuestions[field.label] = field.type;
        });
        await setDoc(doc(db, "forms", formName), {
          questions: formQuestions
        });
        Alert.alert('Form Saved');
        const newDocRef = doc(collection(db, formName));
        await setDoc(newDocRef, {});
        //const d = await getDocs(collection(db, formName));
        //console.log(d);
        //  d.forEach(async(x)=>{
        // //   //console.log(x.id);
        //   // deleteDoc(doc(db, formName, x.id));
        //  });
       // await deleteDoc(doc(db, formName, newDocRef));
        setFormName('');
        setFields([]);
      }
    }
    else{
      alert("this form already exist");
    };
  };

  const saveForm = () => {
    if (!formName.trim()) {
      Alert.alert('Form Name is required');
      return;
    }

    saveToDB();
    // setFormName('');
    // setFields([]);
  };
// give the goback button some margin to the top 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton goBack={navigation.goBack} /> 
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
            <Picker.Item label="List" value="list" />
            <Picker.Item label="Map" value="map" />
          </Picker>
          
        </View>
      ))}
      <View style={styles.fieldControls}>
        <Text style={styles.label}>Add New Field:</Text>
        <Picker
          selectedValue={newFieldType}
          style={styles.picker}
          onValueChange={(itemValue) => setNewFieldType(itemValue)}
        >
          <Picker.Item label="Text" value="text" />
          <Picker.Item label="Number" value="number" />
          <Picker.Item label="Date" value="date" />
          <Picker.Item label="List" value="list" />
          <Picker.Item label="Map" value="map" />
        </Picker>
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
});

export default FormGenerator;
