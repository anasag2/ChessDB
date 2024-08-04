import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  alert,
} from 'react-native';
import db from '../firebaseConfig.js';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

const UpdateFormScreen = () => {
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForms, setFilteredForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [formDetails, setFormDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const loadForms = async () => {
      const formsSnapshot = await getDocs(collection(db, 'forms'));
      const formList = [];
      formsSnapshot.forEach((doc) => {
        formList.push({ id: doc.id, ...doc.data() });
      });
      formList.sort((a, b) => a.id.localeCompare(b.id));
      setForms(formList);
      setFilteredForms(formList);
    };

    loadForms();
  }, []);

  const handleSearch = () => {
    const filtered = forms.filter(form => form.id.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredForms(filtered);
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const handleFormPress = async (formId) => {
    try {
      const formRef = collection(db, formId);
      const formSnapshot = await getDocs(formRef);
      const userGroupList = [];

      for (const docSnap of formSnapshot.docs) {
        const data = docSnap.data();
        if (data.group) {
          const groupRef = doc(db, 'groups', data.group);
          const groupSnap = await getDoc(groupRef);
          const groupData = groupSnap.data();

          if (groupData && groupData.groupName) {
            userGroupList.push({
              userName: data.userName,
              groupName: groupData.groupName,
              questions: data,
            });
          }
        }
      }

      setUserGroups(userGroupList);
      setSelectedForm(formId);
      setModalVisible(true);
    } catch (error) {
      alert('Error fetching user groups:', error);
    }
  };

  const handleUserGroupPress = async (userGroup) => {
    try {
      const formDocRef = doc(db, 'forms', selectedForm);
      const formDocSnap = await getDoc(formDocRef);
      const formQuestions = formDocSnap.data().questions;

      const questionsWithAnswers = Object.keys(formQuestions).map(question => ({
        question,
        answer: userGroup.questions[question] || 'No answer provided',
      }));

      setFormDetails({
        userName: userGroup.userName,
        groupName: userGroup.groupName,
        questionsWithAnswers,
      });

      setModalVisible(false);
      setDetailsModalVisible(true);
    } catch (error) {
      alert('Error fetching form details:', error);
    }
  };

  const renderForm = ({ item }) => (
    <TouchableOpacity onPress={() => handleFormPress(item.id)}>
      <View style={styles.formContainer}>
        {highlightText(item.id, searchQuery)}
      </View>
    </TouchableOpacity>
  );

  const renderUserGroup = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserGroupPress(item)}>
      <View style={styles.userGroupContainer}>
        <Text>{'User: '}{item.userName} -{' Group: '} {item.groupName}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFormDetails = ({ item }) => {
    const formatAnswer = (answer) => {
      if (Array.isArray(answer)) {
        return answer.join(' - '); // Join array elements with semicolon and space
      }
      return answer;
    };

    return (
      <View style={styles.detailContainer}>
        <Text style={styles.detailQuestion}>{item.question}</Text>
        <Text style={styles.detailAnswer}>{formatAnswer(item.answer)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Forms"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={[styles.roundButton, styles.searchButton]} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredForms}
        keyExtractor={(item) => item.id}
        renderItem={renderForm}
        style={styles.list}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Teachers and Groups for {selectedForm}</Text>
            <FlatList
              data={userGroups}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderUserGroup}
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={detailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Q&A for {'User: '}{formDetails?.userName} {'-> Group: '} {formDetails?.groupName}</Text>
            <FlatList
              data={formDetails?.questionsWithAnswers || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderFormDetails}
            />
            <TouchableOpacity
              style={[styles.roundButton, styles.closeButton]}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const colors = {
  purple: '#663D99',
  lightGrey: '#F1F4F9',
  yellow: '#F0C10F',
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.purple,
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  formContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  userGroupContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  detailContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  detailQuestion: {
    fontWeight: 'bold',
  },
  detailAnswer: {
    marginLeft: 10,
  },
  highlight: {
    backgroundColor: 'yellow',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  roundButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: colors.purple,
  },
});

export default UpdateFormScreen;
