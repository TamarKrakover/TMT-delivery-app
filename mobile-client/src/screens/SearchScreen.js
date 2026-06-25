import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/common.styles';

export default function SearchScreen() {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.centeredContent}>
        <Text style={commonStyles.title}>Search</Text>
        <Text style={commonStyles.subtitle}>Search logic will be implemented here later.</Text>
      </View>
    </SafeAreaView>
  );
}


