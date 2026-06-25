import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/HomeScreen.styles';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, userSession }) {
  // Temporary header setup inside the screen for demonstration
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          {userSession?.profilePicUri ? (
            <Image source={{ uri: userSession.profilePicUri }} style={styles.profilePic} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userSession?.username?.charAt(0)?.toUpperCase() || 'U'}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Hello, {userSession?.name || userSession?.username}!</Text>
        <Text style={styles.subtitle}>Welcome to the Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}


