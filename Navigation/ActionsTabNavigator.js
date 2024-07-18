import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import FormGenerator from '../screens/FormGenerator';
import CreateUserScreen from '../screens/CreateUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UpdateUserScreen from '../screens/UpdateUserScreen';
import CreateGroupScreen from '../screens/CreateGroupsScreen';
import LessonsScreen from '../screens/LessonsScreen';
import UpdateLessonScreen from '../screens/UpdateLessonScreen';
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
      return <LessonsScreen />;
    } else {
      return <SettingsScreen />;
    }
  }

  const UpdateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <UpdateUserScreen />;
    } else if (user["actionType"] === 'Lessons') {
      return <UpdateLessonScreen />;
    } else {
      return <SettingsScreen />;
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Create') {
            iconName = 'home';
          } else if (route.name === 'Update') {
            iconName = 'cog';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
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
        name="Update" 
        component={UpdateActionType}
        options={{ tabBarLabel: 'Update', headerTitle: '' }}
      />
    </Tab.Navigator>
  );
}

export default ActionsTabNavigator;
