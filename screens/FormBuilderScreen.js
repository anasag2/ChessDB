import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    loadStudents();
  }, []);
  const loadStudents = async () => {
    try {
      const groupRef = doc(db, 'groups', form.group);
      const studentsCollectionRef = collection(groupRef, 'students');
      const studentDocs = await getDocs(studentsCollectionRef);
      const studentList = studentDocs.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setStudents(studentList);
      
    } catch (error) {
      alert("Error loading students: ", error);
    }
  };
  const handleSelectStudent = (student) => {
    if (selectedStudents.includes(student.id)) {
      setSelectedStudents(selectedStudents.filter(id => id !== student.id));
     
    } else {
      setSelectedStudents([...selectedStudents, student.id]);
    
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
  const handleAddStudent = () => {
    setModalVisible(true);
  };

  const handleSubmitStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: studentName,
      school: schoolName,
      phone: phoneNumber,
    };
    setStudents([...students, newStudent]);
    setModalVisible(false);
    setStudentName('');
    setSchoolName('');
    setPhoneNumber('');
  };

  

  const handleSubmit = async() => {
    // Create the initial responses array with form values
    const responses = form.data.map(question => {
      // Check if the question type is 'students'
      if (question.type === 'students') {
        // Filter and map the selected students
        const studentNames = students
          .filter(student => selectedStudents.includes(student.id))
          .map(student => student.name);
        
        // Return the response with the question and formatted student names
        return {
          question: question.question,
          answer: studentNames // Join names into a comma-separated string
        };
      } else {
        // Return the response for other question types
        return {
          question: question.question,
          answer: formValues[question.id] || '',
        };
      }
    });
  
  
    // Create a new document reference
    const newDocRef = doc(collection(db, form.formName));
    let infos = { userName: form.userName, group: form.group };
  
    // Add responses to the infos object
    responses.forEach(element => {
      infos[element.question] = element.answer;
    });
  
    // Save the document to Firestore
    await setDoc(newDocRef, infos);
    Alert.alert('Form Submitted');
  
    // Update forms_to_fill and navigate to the HomePage
    let forms_to_fill = form.forms_to_fill;
    f = {};
    for (const [key, value] of forms_to_fill.entries()) {
      if (key !== form.group) {
        f[key] = value;
      }
    }
  
    const userData = form["userData"];
    navigation.navigate("HomePage", { userData });
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
      
        <View>
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
          <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
                <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity>
          </View>
       
       
          )}
          
          {/* <TouchableOpacity style={styles.buttonStyle} onPress={handleAddStudent}>
                <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity> */}
          
        </View>
        
      ))}
     
    
    <Button title="Submit" onPress={handleSubmit} />

    <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Student</Text>
          <TextInput
            placeholder="Student Name"
            value={studentName}
            onChangeText={setStudentName}
            style={styles.input}
          />
          <TextInput
            placeholder="School Name"
            value={schoolName}
            onChangeText={setSchoolName}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button title="Submit" onPress={handleSubmitStudent} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },

});

export default FormScreen;