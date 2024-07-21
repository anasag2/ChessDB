import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import FormGenerator from '../screens/FormGenerator';
import CreateUserScreen from '../screens/CreateUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchGroupScreen from '../screens/SearchGroupScreen';
import FormUpdateScreen from '../screens/FormUpdateScreen';
import ReadUserScreen from '../screens/ReadUserScreen';
import UpdateUserScreen from '../screens/UpdateUserScreen';
import CreateGroupScreen from '../screens/CreateGroupsScreen';
import CreateLessonsScreen from '../screens/CreateLessonsScreen';
import UpdateLessonScreen from '../screens/UpdateLessonScreen';
import CreateSchoolScreen from '../screens/CreateSchoolScreen';
import UpdateSchoolScreen from '../screens/UpdateSchoolScreen';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const ActionsTabNavigator = () => {
  const route2 = useRoute();
  const user = route2.params;
  const CreateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <CreateUserScreen />;
    } else if (user["actionType"] === 'Group') {
      return <CreateGroupScreen />;
    } else if (user["actionType"] === 'Lessons') {
      return <CreateLessonsScreen />;
    } else if (user.actionType === 'Schools') {
      return <CreateSchoolScreen />;
    } else {
      return <SettingsScreen />;
    }
  }

  const UpdateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormUpdateScreen />;
    } else if (user["actionType"] === 'User') {
      return <UpdateUserScreen />;
    } else if (user["actionType"] === 'Group') {
      return <SearchGroupScreen />;
    } else if (user["actionType"] === 'Lessons') {
      return <UpdateLessonScreen />;
    } else if (user.actionType === 'Schools') {
      return <UpdateSchoolScreen />;
    } else {
      return <SettingsScreen />;
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Create':
              iconName = 'plus-square';
              break;
            case 'search':
              iconName = 'search';
              break;
            default:
              iconName = 'circle';
              break;
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#663D99',
        tabBarInactiveTintColor: 'gray',
        headerShown:false,
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen
        name="Create"
        component={CreateActionType}
        options={{ tabBarLabel: 'Create', headerTitle: '' }}
      />
      <Tab.Screen
        name="search"
        component={UpdateActionType}
        options={{
          tabBarLabel: 'search',
          headerTitle: '',
        }}
      />
    </Tab.Navigator>
  );
}

export default ActionsTabNavigator;