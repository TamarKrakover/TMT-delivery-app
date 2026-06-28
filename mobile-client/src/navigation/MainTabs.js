import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import createStyles from '../styles/MainTabs.styles';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  // Pass down userSession to children if needed
  const { userSession } = route.params || {};
  const { theme } = useTheme();
  const { cartItems } = useCart();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Calculate total items in cart
  const cartItemCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary || '#00c2e8',
        tabBarInactiveTintColor: theme.textSecondary || '#4b5563',
        tabBarStyle: styles.tabBar,
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
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      
      <Tab.Screen 
        name="SearchTab" 
        options={{ title: 'Search' }} 
      >
        {(props) => <SearchScreen {...props} userSession={userSession} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ 
          title: 'Cart',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
          tabBarBadgeStyle: styles.tabBarBadge
        }} 
      />
    </Tab.Navigator>
  );
}

