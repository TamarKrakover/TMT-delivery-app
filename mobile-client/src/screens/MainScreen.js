import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService, clearUserSession, BASE_URL } from '../services/api';
import styles from '../styles/MainScreen.styles';

export default function MainScreen({ userSession, onLogout }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // Fetch user info from backend using userSession.id
        const data = await authService.getUserDetails(userSession.id);
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user profile details:', error);
        Alert.alert('Error', 'Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    if (userSession && userSession.id) {
      fetchUserDetails();
    }
  }, [userSession]);

  const handleLogout = async () => {
    try {
      await clearUserSession();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during logout');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Get full profile image URL (handling relative URLs from backend)
  const getProfilePicUri = () => {
    if (!userDetails || !userDetails.profilePic) return null;
    if (userDetails.profilePic.startsWith('http')) return userDetails.profilePic;
    return `${BASE_URL}${userDetails.profilePic}`;
  };

  const profilePicUri = getProfilePicUri();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.welcomeText}>Hello, {userDetails?.name || userSession.username}!</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {profilePicUri ? (
            <Image source={{ uri: profilePicUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userDetails?.name?.charAt(0) || 'U'}</Text>
            </View>
          )}
          
          <Text style={styles.usernameText}>@{userDetails?.username}</Text>
          <Text style={styles.roleText}>{userDetails?.role === 'customer' ? 'Customer' : 'Admin'}</Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.content}>
          <Text style={styles.placeholderTitle}>Welcome to TMT!</Text>
          <Text style={styles.placeholderDesc}>
            Find the best local restaurants and order delicious food right to your doorstep.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

