import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

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

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    ...FONTS.h3,
    color: '#1f2937',
    marginBottom: SIZES.xs,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'left',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'left',
    marginTop: SIZES.xs,
  },
});
