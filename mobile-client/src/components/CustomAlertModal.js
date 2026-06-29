import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomAlertModal({
  visible,
  title,
  message,
  onClose,
  buttons = []
}) {
  const { theme } = useTheme();

  const defaultButtons = [
    {
      text: 'OK',
      onPress: onClose,
      style: 'primary'
    }
  ];

  const displayButtons = buttons.length > 0 ? buttons : defaultButtons;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {title ? <Text style={[styles.title, { color: theme.text }]}>{title}</Text> : null}
          {message ? <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text> : null}
          
          <View style={styles.buttonRow}>
            {displayButtons.map((btn, index) => {
              const isPrimary = btn.style === 'primary';
              const isDanger = btn.style === 'danger';
              
              let buttonStyle = [styles.secondaryButton, { backgroundColor: theme.borderLight, borderColor: theme.border }];
              let textStyle = [styles.secondaryButtonText, { color: theme.textSecondary }];
              
              if (isPrimary) {
                buttonStyle = [styles.primaryButton, { backgroundColor: COLORS.primary }];
                textStyle = [styles.primaryButtonText, { color: '#ffffff' }];
              } else if (isDanger) {
                buttonStyle = [styles.dangerButton, { backgroundColor: COLORS.danger }];
                textStyle = [styles.dangerButtonText, { color: '#ffffff' }];
              }
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[buttonStyle, btn.customStyle]}
                  onPress={() => {
                    if (btn.onPress) btn.onPress();
                    onClose();
                  }}
                >
                  <Text style={[textStyle, btn.customTextStyle]}>{btn.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...FONTS.body2,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dangerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
