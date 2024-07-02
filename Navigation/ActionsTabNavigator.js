import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import FormGenerator from '../screens/FormGenerator';
import CreatUserScreen from '../screens/CreatUserScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReadUserScreen from '../screens/ReadUserScreen';
import { useRoute } from '@react-navigation/native';
import { Settings } from 'react-native';

const Tab = createBottomTabNavigator();

const ActionsTabNavigator = () => {
  const route2 = useRoute();
  const user = route2.params;

  const CreateActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <CreatUserScreen />;
    } else {// we need to change this
      return <Settings />;
    }
  }

  const ReadActionType = () => {
    if (user["actionType"] === 'Form') {
      return <FormGenerator />;
    } else if (user["actionType"] === 'User') {
      return <ReadUserScreen />;
    } else {// we need to change this
      return <CreatUserScreen />;
    }
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Create') {
            iconName = 'home';// karmi needs to change them 
          } else if (route.name === 'Read') {
            iconName = 'wpforms';
          } else if (route.name === 'Update') {
            iconName = 'cog';
          }else if (route.name === 'Delete') {
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
      />
      <Tab.Screen name="Read" component={ReadActionType} />
      <Tab.Screen name="Update" component={SettingsScreen} />
      <Tab.Screen name="Delete" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default ActionsTabNavigator;
