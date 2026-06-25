import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/common.styles';
import { useTheme } from '../contexts/ThemeContext';

export default function CartScreen() {
  const { theme } = useTheme();
  const styles = React.useMemo(() => commonStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Your cart is empty.</Text>
      </View>
    </SafeAreaView>
  );
}
