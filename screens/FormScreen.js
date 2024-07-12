import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const formDataSet = [
  {
    name: 'form1',
    data: [
      { id: '1', question: 'الاسم؟', type: 'text' },
      { id: '2', question: 'العمر؟', type: 'number' },
      { id: '3', question: 'تاريخ الولادة؟', type: 'date' },
      { id: '4', question: 'شو وظيفتك بالحياة؟', type: 'list', options: ['مدرب', 'مسؤول', 'معلم'] },
    ],
  },
  {
    name: 'form2',
    data: [
      { id: '1', question: 'ما هو عنوانك؟', type: 'text' },
      { id: '2', question: 'رقم هاتفك؟', type: 'number' },
      { id: '3', question: 'موعد ميلادك؟', type: 'date' },
      { id: '4', question: 'ما هو مجال عملك؟', type: 'list', options: ['طبيب', 'مهندس', 'معلم'] },
    ],
  },
  {
    name: 'form3',
    data: [
      { id: '1', question: 'اسم الشركة؟', type: 'text' },
      { id: '2', question: 'عدد الموظفين؟', type: 'number' },
      { id: '3', question: 'تاريخ التأسيس؟', type: 'date' },
      { id: '4', question: 'ما هو مجال الشركة؟', type: 'list', options: ['تكنولوجيا', 'صناعة', 'تعليم'] },
    ],
  },
];

export default function FormListScreen() {
  const [completedForms, setCompletedForms] = useState([]);
  const navigation = useNavigation();

  const markAsCompleted = (formName) => {
    setCompletedForms((prev) => [...prev, formName]);
  };

  return (
    <View style={styles.container}>
      <Text>Forms to fill</Text>
      <FlatList
        data={formDataSet}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.formItem}
            onPress={() => navigation.navigate('Form', { form: item, markAsCompleted })}
          >
            <Text>{item.name}</Text>
            {completedForms.includes(item.name) && <Text style={styles.checkmark}>✔️</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkmark: {
    color: 'green',
  },
});
