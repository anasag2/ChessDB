import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import SettingsScreen from '../screens/SettingsScreen';
import FormScreen from '../screens/FormScreen';
import AdminAction from '../screens/AdminAction';
import FormBuilderScreen from '../screens/FormBuilderScreen'
import HomeScreen from '../screens/HomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const route2 = useRoute();
  const user = route2.params;

  const AdminOrUser = () => {
    if (user["userData"]["role"] === 'admin') {
      return <AdminAction />;
    } else {
      return <FormScreen />;
    }
  }

  // const AdminOrUserAction = () => {
  //   if (user["userData"]["role"] === 'admin') {
  //     return < AdminAction/>;
  //   } else {
  //     return <FormScreen />;
  //   }
  // }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'wpforms';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
          "tabBarActiveTintColor": '#663D99',
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
      options={{ tabBarLabel: 'Home',
                  headerTitle: ''
      }}
      />
      {/* <Tab.Screen name="Forms" component={AdminOrUserAction} /> */}
      {/*<Tab.Screen name="Settings" component={SettingsScreen} />*/}
    </Tab.Navigator>
  );
}

export default TabNavigator;