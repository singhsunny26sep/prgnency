import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlaceholderScreenProps {
  route?: { params?: { title?: string } };
  title?: string;
}

const PlaceholderScreen = ({ route, title }: PlaceholderScreenProps) => {
  const screenTitle = route?.params?.title || title || 'Screen';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{screenTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7' },
  text: { fontSize: 18, color: '#666' },
});

export default PlaceholderScreen;