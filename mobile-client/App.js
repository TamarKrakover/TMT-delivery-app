import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getUserSession } from './src/services/api';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MainTabs from './src/navigation/MainTabs';
import { COLORS } from './src/theme/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getUserSession();
      setUserSession(session);
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (session) => {
    setUserSession(session);
  };

  const handleLogout = () => {
    setUserSession(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || '#00c2e8'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userSession ? (
          // Authorized Stack
          <>
            <Stack.Screen name="Main" initialParams={{ userSession }}>
              {(props) => (
                <MainTabs
                  {...props}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => (
                <ProfileScreen
                  {...props}
                  userSession={userSession}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

