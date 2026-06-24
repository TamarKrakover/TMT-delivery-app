import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService, setUserSession } from '../services/api';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import styles from '../styles/LoginScreen.styles';


export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Real-time validations
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isUsernameValid = username.trim().length > 0;
  const isPasswordValid = password.length > 0;
  const isFormValid = isUsernameValid && isPasswordValid;

  const handleLogin = async () => {
    setUsernameTouched(true);
    setPasswordTouched(true);

    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      const res = await authService.login(username.trim(), password);
      
      // Save session
      const session = { id: res.id, username: username.trim() };
      await setUserSession(session);
      
      // Trigger App.js update
      if (onLoginSuccess) {
        onLoginSuccess(session);
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <View style={styles.inner}>
      {/* Header / Logo Area */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.titleText}>Sign In</Text>
        <Text style={styles.subtitleText}>Sign in to order your favorite food</Text>
      </View>

      {/* Form Area */}
      <View style={styles.formContainer}>
        <InputField
          label="Username"
          placeholder="Enter username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setUsernameTouched(true);
          }}
          showError={usernameTouched && !isUsernameValid}
          errorText="Username is required"
        />

        <InputField
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordTouched(true);
          }}
          showError={passwordTouched && !isPasswordValid}
          errorText="Password is required"
        />

        {/* Submit Button */}
        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          disabled={!isFormValid}
          loading={loading}
        />
      </View>

      {/* Navigation to Register */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'web' ? (
        renderContent()
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {renderContent()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

