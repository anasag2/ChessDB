import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FormScreen from '../screens/FormScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const route = useRoute();
  const user = route.params;

  const AdminOrUser = () => {
    if (user["userData"]["user_type"] === 'admin') {
      return <AdminHomeScreen />;
    } else {
      return <HomeScreen />;
    }
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Form') {
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
      // tabBarOptions={{
      //   activeTintColor: 'tomato',
      //   inactiveTintColor: 'gray',
      // }}
    >
      <Tab.Screen 
      name="Home" 
      component={AdminOrUser}
      initialParams={ user }
      />
      <Tab.Screen name="Form" component={FormScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
