import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/common.styles';

export default function CartScreen() {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.centeredContent}>
        <Text style={commonStyles.title}>Shopping Cart</Text>
        <Text style={commonStyles.subtitle}>Your selected items will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}


