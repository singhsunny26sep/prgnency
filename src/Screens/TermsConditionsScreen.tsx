import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last updated: May 2026</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.bodyText}>
          By accessing or using our services, you agree to be bound by these Terms and Conditions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Use of Services</Text>
        <Text style={styles.bodyText}>
          You agree to use our services only for their intended purpose and in accordance with applicable laws.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Account Registration</Text>
        <Text style={styles.bodyText}>
          You must provide accurate information when registering for an account and keep it updated.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
        <Text style={styles.bodyText}>
          All content, trademarks, and other intellectual property displayed on our services are owned by us.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.bodyText}>
          We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
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

export default TermsConditionsScreen;