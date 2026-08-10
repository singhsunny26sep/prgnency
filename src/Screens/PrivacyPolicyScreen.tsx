import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: May 2026</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.bodyText}>
          We collect information you provide directly to us, including your name, email, phone number, and any other information you choose to share.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.bodyText}>
          We use the information we collect to provide and improve our services, communicate with you, and personalize your experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.bodyText}>
          We do not share your personal information with third parties except as described in this policy.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.bodyText}>
          We implement security measures to protect your information from unauthorized access or disclosure.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.bodyText}>
          You have the right to access, correct, or delete your personal information at any time.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { padding: 16, backgroundColor: '#FFE4E9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  lastUpdated: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  bodyText: { fontSize: 14, color: '#666', lineHeight: 20 },
});

export default PrivacyPolicyScreen;