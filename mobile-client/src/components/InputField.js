import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { COLORS } from '../theme/theme';
import styles from '../styles/InputField.styles';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  errorText,
  showError = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  keyboardType = 'default',
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          showError && styles.inputError
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary || '#94a3b8'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
      />
      {showError && errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}
    </View>
  );
}
