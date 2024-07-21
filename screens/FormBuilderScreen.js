import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native'; 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import db from '../firebaseConfig.js';
import MultiSelect from 'react-native-multiple-select';
import { collection, getDocs, setDoc, doc, writeBatch, getDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';


const FormScreen = () => {
  const route = useRoute();
  const { form, markAsCompleted } = route.params;
  const [formValues, setFormValues] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);
  const navigation = useNavigation();
  //console.log(form);
  //console.log(markAsCompleted);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const students  = [
    { id: 1, name: 'Sami' },
    { id: 2, name: 'Abdallah' },
    { id: 3, name: 'Karmi' },
    { id: 4, name: 'Ahmad' },
    { id: 6, name: 'Anas' },
    { id: 7, name: 'kal' },
    { id: 8, name: 'Anasaas' },
  ];
  const handleSelectStudent = (student) => {
    if (selectedStudents.includes(student.id)) {
      setSelectedStudents(selectedStudents.filter(id => id !== student.id));
     
    } else {
      setSelectedStudents([...selectedStudents, student.id]);
      console.log(selectedStudents);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectStudent(item)}>
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      {selectedStudents.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      )}
    </View>
  </TouchableOpacity>
  );


  const handleInputChange = (id, value) => {
    setFormValues({ ...formValues, [id]: value });
  };
 

  const handleDateChange = (event, selectedDate, id) => {
    setShowDatePicker(null);
    handleInputChange(id, selectedDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async() => {
    const responses = form.data.map(question => ({
      question: question.question,
      answer: formValues[question.id] || '',
    }));
    //console.log('User Responses:', responses);
    const newDocRef = doc(collection(db, form.formName));
    let infos = {userName:form.userName, group:form.group};
    responses.forEach(element => {
      infos[element.question] = element.answer;
      //console.log(infos);  
    });
    await setDoc(newDocRef, infos);
    Alert.alert('Form Submitted');
    let forms_to_fill = form.forms_to_fill;
    //const formsMap = new Map(Object.entries(forms_to_fill));
    //console.log(forms_to_fill);
    f = {};
    for (const [key, value] of forms_to_fill.entries()) {
      if(key !== form.group){
        f[key] = value;
      };
    };
    //console.log(f);
    //const batch = writeBatch(db);
    //const userRef = doc(db, "users", form.id);
    //batch.update(userRef, {"forms_to_fill": f});
    //navigation.navigate('Login');
    //await batch.commit();
    // form.forms_to_fill.delete(form.group);
    // console.log(form.forms_to_fill);
    // const userRef1 = doc(db, "users", form.id);
    // const user = await getDoc(userRef1);
    //console.log(form);
    const userData = form["userData"];
    // userData["forms_to_fill"] = f;
    // //console.log(userData.forms_to_fill);
    navigation.navigate("HomePage", { userData });
    //markAsCompleted(form.name);
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    
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
          
          {question.type === 'students' && (
          //   <View style={styles.containerf}>
          //   <FlatList
          //   nestedScrollEnabled
          //   data={students}
          //   renderItem={renderUser}
          //   keyExtractor={item => item.id}
            
          // />
          //  </View>
          <MultiSelect
          items={students}
          uniqueKey="id"
          onSelectedItemsChange={setSelectedStudents}
          selectedItems={selectedStudents}
          selectText="Pick Students"
          searchInputPlaceholderText="Search Student..."
          tagRemoveIconColor={colors.yellow}
          tagBorderColor={colors.purple}
          tagTextColor={colors.purple}
          selectedItemTextColor={colors.yellow}
          selectedItemIconColor={colors.yellow}
          itemTextColor={colors.purple}
          displayKey="name"
          searchInputStyle={{ color: colors.purple }}
          submitButtonColor={colors.yellow}
          submitButtonText="Submit"
        />
            //to do by karmi
            // <MultiSelect
            // items={Student}
            // uniqueKey="id"
            // onSelectedItemsChange={setSelectedStudent}
            // selectedItems={selectedTeachers}
            // selectText="Pick Student"
            // searchInputPlaceholderText="Search Student..."
            // tagRemoveIconColor={colors.yellow}
            // tagBorderColor={colors.purple}
            // tagTextColor={colors.purple}
            // selectedItemTextColor={colors.yellow}
            // selectedItemIconColor={colors.yellow}
            // itemTextColor={colors.purple}
            // displayKey="name"
            // searchInputStyle={{ color: colors.purple }}
            // submitButtonColor={colors.yellow}
            // submitButtonText="Submit"
          // />
          )}
          
          {/* <TouchableOpacity style={styles.buttonStyle} onPress={handleAddStudent}>
                <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity> */}
          
        </View>
        
      ))}
     
    
    <Button title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F'
};

const styles = StyleSheet.create({
  containerf: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
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