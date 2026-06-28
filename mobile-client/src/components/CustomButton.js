import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styles from '../styles/CustomButton.styles';

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
