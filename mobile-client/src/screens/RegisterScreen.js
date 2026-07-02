import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../services/api';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import styles from '../styles/RegisterScreen.styles';
import CustomAlertModal from '../components/CustomAlertModal';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [imageAsset, setImageAsset] = useState(null);
  const [role, setRole] = useState('customer');
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

  // Field interaction tracking
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [latTouched, setLatTouched] = useState(false);
  const [lngTouched, setLngTouched] = useState(false);

  // Validations
  const isUsernameValid = username.trim().length > 0;
  const isNameValid = name.trim().length > 0;
  
  // Password validation: At least 8 characters long, must contain both letters and numbers
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  const isPasswordValid = passwordRegex.test(password);
  
  const isConfirmPasswordValid = confirmPassword === password && confirmPassword.length > 0;
  const isImageValid = imageAsset !== null;

  // Coordinate validations (must be valid numbers)
  const isLatValid = lat.trim().length > 0 && !isNaN(parseFloat(lat));
  const isLngValid = lng.trim().length > 0 && !isNaN(parseFloat(lng));

  const isFormValid =
    isUsernameValid &&
    isNameValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isLatValid &&
    isLngValid;

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Error', 'Gallery permission is required to pick an image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageAsset(result.assets[0]);
      }
    } catch (err) {
      showAlert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Error', 'Camera permission is required to take a photo');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageAsset(result.assets[0]);
      }
    } catch (err) {
      showAlert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handleRegister = async () => {
    setUsernameTouched(true);
    setNameTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setLatTouched(true);
    setLngTouched(true);

    if (!isFormValid) {
      showAlert('Error', 'Please fill in all fields correctly');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload profile image to the backend first (if provided)
      let profilePicUrl = '';
      if (imageAsset) {
        const uploadRes = await authService.uploadImage(imageAsset);
        profilePicUrl = uploadRes.url; // e.g., /api/uploads/misc/filename.jpg
      }

      // 2. Register user
      const userData = {
        username: username.trim(),
        password,
        name: name.trim(),
        role: role,
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        profilePic: profilePicUrl,
      };

      await authService.register(userData);
      
      showAlert('Success!', 'Your account has been created successfully. You can sign in now.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login'), style: 'primary' }
      ]);
    } catch (error) {
      showAlert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.titleText}>Sign Up</Text>
            <Text style={styles.subtitleText}>Sign up to start ordering your favorite food</Text>
          </View>

          {/* Profile Picture Selector (Optional) */}
          <View style={styles.avatarContainer}>
            <Text style={{ fontSize: 14, color: '#4b5563', fontWeight: 'bold', marginBottom: SIZES.sm }}>Profile Picture (Optional)</Text>
            {imageAsset ? (
              <Image source={{ uri: imageAsset.uri }} style={styles.avatarPreview} />
            ) : (
              <View style={[styles.avatarPreview, { backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#ffffff', fontSize: 36, fontWeight: 'bold' }}>
                  {(name.trim() || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.imageButtonsRow}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
                <Text style={styles.imageButtonText}>Pick from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.imageButton, styles.imageButtonOutline]} onPress={takePhotoWithCamera}>
                <Text style={styles.imageButtonOutlineText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Fields */}
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
              label="Full Name"
              placeholder="Enter full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameTouched(true);
              }}
              showError={nameTouched && !isNameValid}
              errorText="Full name is required"
            />

            {/* Account Type Selector */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Account Type</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    role === 'customer' && styles.roleCardActive
                  ]}
                  onPress={() => setRole('customer')}
                >
                  <Ionicons 
                    name="cart-outline" 
                    size={20} 
                    color={role === 'customer' ? COLORS.primary : '#4b5563'} 
                  />
                  <Text style={[
                    styles.roleText,
                    role === 'customer' && styles.roleTextActive
                  ]}>Regular User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    role === 'owner' && styles.roleCardActive
                  ]}
                  onPress={() => setRole('owner')}
                >
                  <Ionicons 
                    name="restaurant-outline" 
                    size={20} 
                    color={role === 'owner' ? COLORS.primary : '#4b5563'} 
                  />
                  <Text style={[
                    styles.roleText,
                    role === 'owner' && styles.roleTextActive
                  ]}>Restaurant Owner</Text>
                </TouchableOpacity>
              </View>
            </View>

            <InputField
              label="Password"
              placeholder="Min 8 chars, letters & numbers"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordTouched(true);
              }}
              showError={passwordTouched && !isPasswordValid}
              errorText="Password must be at least 8 characters, containing both letters and numbers"
            />

            <InputField
              label="Confirm Password"
              placeholder="Re-enter password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordTouched(true);
              }}
              showError={confirmPasswordTouched && !isConfirmPasswordValid}
              errorText="Passwords do not match"
            />

            <InputField
              label="Latitude"
              placeholder="e.g. 32.08"
              value={lat}
              onChangeText={(text) => {
                setLat(text);
                setLatTouched(true);
              }}
              keyboardType="numeric"
              showError={latTouched && !isLatValid}
              errorText="Latitude must be a valid number"
            />

            <InputField
              label="Longitude"
              placeholder="e.g. 34.78"
              value={lng}
              onChangeText={(text) => {
                setLng(text);
                setLngTouched(true);
              }}
              keyboardType="numeric"
              showError={lngTouched && !isLngValid}
              errorText="Longitude must be a valid number"
            />

            {/* Submit Button */}
            <CustomButton
              title="Sign Up"
              onPress={handleRegister}
              disabled={!isFormValid}
              loading={loading}
            />
          </View>

          {/* Footer Back to Login */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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

