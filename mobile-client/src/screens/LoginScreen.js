import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import styles from '../styles/LoginScreen.styles';
import { useAuth } from '../contexts/AuthContext';
import CustomAlertModal from '../components/CustomAlertModal';


export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  const showAlert = (title, message, buttons = []) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setAlertVisible(true);
  };
  
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
      showAlert('Error', 'Please fill in all fields correctly');
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      const res = await authService.login(username.trim(), password);
      
      // Fetch full user details from backend using x-user-id
      const fullUserData = await authService.getUserDetails(res.id, res.id);
      
      // Update global context session
      await login(fullUserData);
    } catch (error) {
      showAlert('Login Failed', error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const res = await authService.login('user1', 'Password123!');
      const guestUser = {
        id: res.id,
        isGuest: true,
        username: 'guest',
        displayName: 'Guest User',
        role: 'customer',
        profilePic: '',
        location: { lat: 32.0853, lng: 34.7818 }
      };
      await login(guestUser);
    } catch (error) {
      console.log('Failed background guest login:', error.message);
      await login({
        isGuest: true,
        username: 'guest',
        displayName: 'Guest User',
        role: 'customer',
        profilePic: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <>
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

        {/* Continue as Guest Button */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            marginTop: 12,
            borderColor: '#00c2e8',
            borderWidth: 1,
            borderRadius: 8,
          }}
          onPress={handleGuestLogin}
        >
          <Text style={{ fontSize: 16, color: '#00c2e8', fontWeight: 'bold' }}>
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation to Register */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === 'web' ? (
        <View style={styles.inner}>
          {renderContent()}
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={styles.container}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.inner} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      <CustomAlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

