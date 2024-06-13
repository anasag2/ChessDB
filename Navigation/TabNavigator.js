import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FormScreen from '../screens/FormScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminAction from '../screens/AdminAction';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const route2 = useRoute();
  const user = route2.params;

  const AdminOrUser = () => {
    if (user["userData"]["user_type"] === 'admin') {
      return <AdminHomeScreen />;
    } else {
      return <HomeScreen />;
    }
  }

  const AdminOrUserAction = () => {
    if (user["userData"]["user_type"] === 'admin') {
      return < AdminAction/>;
    } else {
      return <FormScreen />;
    }
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Actions') {
            iconName = 'wpforms';
          } else if (route.name === 'Settings') {
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
      name="Home" 
      component={AdminOrUser}
      initialParams={ user }
      />
      <Tab.Screen name="Actions" component={AdminOrUserAction} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
