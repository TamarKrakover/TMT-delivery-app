import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/ProfileScreen.styles';

export default function ProfileScreen({ userSession, onLogout }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Settings</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Username: {userSession?.username}</Text>
          <Text style={styles.label}>Role: {userSession?.role}</Text>
        </View>

        {/* Day / Night Toggle placeholder */}
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Toggle Dark Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


