import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import FormGenerator from '../screens/FormGenerator';
import CreatUserScreen from '../screens/CreatUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchGroupScreen from '../screens/SearchGroupScreen';
import ReadUserScreen from '../screens/ReadUserScreen';
import UpdateUserScreen from '../screens/UpdateUserScreen';
import CreateGroupScreen from '../screens/CreateGroupsScreen';
import { useRoute } from '@react-navigation/native';
import { Settings } from 'react-native';
//import BackButton from '../components/BackButton';  // Adjust the path as needed


const Tab = createBottomTabNavigator();

const ActionsTabNavigator = () => {
  const route2 = useRoute();
  const user = route2.params;

  const CreateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <CreatUserScreen />;
    }else if (user["actionType"] === 'Group') {
      return <CreateGroupScreen />;
    }
     else {// we need to change this
      return <SettingsScreen />;
    }
  }

  // const ReadActionType = () => {
  //   if (user["actionType"] === 'Form') {
  //     return <FormGenerator />;
  //   } else if (user["actionType"] === 'User') {
  //     return <ReadUserScreen />;
  //   } else {// we need to change this
  //     return <CreatUserScreen />;
  //   }
  // }

  const UpdateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <UpdateUserScreen />;
    } else if (user["actionType"] === 'Group') {
      return <SearchGroupScreen />;
    }
    else {// we need to change this
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
        headerShown: false, // This hides the header
      })}
    >
      <Tab.Screen
        name="Create"
        component={CreateActionType}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen
        name="search"
        component={UpdateActionType}
        options={{
          tabBarLabel: 'search',
        }}
      />
    </Tab.Navigator>
  );
}

export default ActionsTabNavigator;