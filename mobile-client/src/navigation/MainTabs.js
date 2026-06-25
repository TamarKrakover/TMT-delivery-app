import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  // Pass down userSession to children if needed
  const { userSession } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary || '#00c2e8',
        tabBarInactiveTintColor: COLORS.textSecondary || '#4b5563',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.border || '#e5e7eb',
          paddingBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        options={{ title: 'Home' }}
      >
        {(props) => <HomeScreen {...props} userSession={userSession} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen} 
        options={{ title: 'Search' }} 
      />
      
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ title: 'Cart' }} 
      />
    </Tab.Navigator>
  );
}
