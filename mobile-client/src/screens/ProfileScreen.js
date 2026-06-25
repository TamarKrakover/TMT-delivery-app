import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '../styles/ProfileScreen.styles';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen({ userSession, onLogout }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Settings</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Username: {userSession?.username}</Text>
          <Text style={styles.label}>Role: {userSession?.role}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


