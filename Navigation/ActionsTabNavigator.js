import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import FormGenerator from '../screens/FormGenerator';
import CreatUserScreen from '../screens/CreatUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
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
    } else {// we need to change this
      return <SettingsScreen />;
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Create') {
            iconName = 'home';// karmi needs to change them 
          }  else if (route.name === 'Update') {
            iconName = 'cog';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
          "tabBarActiveTintColor": "tomato",
          "tabBarInactiveTintColor": "gray",
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
      })}
    >
      <Tab.Screen 
        name="Create" 
        component={CreateActionType}
        options={({ navigation }) => ({
          tabBarLabel: 'Create',
          headerTitle: '',
        })}
      />
      <Tab.Screen 
        name="Update" 
        component={UpdateActionType}
        options={({ navigation }) => ({
          tabBarLabel: 'Update',
          headerTitle: '',
        })}
      />
      
    </Tab.Navigator>
  );
}

export default ActionsTabNavigator;
