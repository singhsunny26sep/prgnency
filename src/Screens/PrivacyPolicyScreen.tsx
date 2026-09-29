import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ============================================
// CONFIG — Apni details yahan update karein
// ============================================
const APP_NAME = 'HiranyaGarbhaSanskar';
const COMPANY_NAME = 'Hiranyagarbh Sanskar Pvt. Ltd.';
const CONTACT_EMAIL = 'hiranyagarbhagarbhasanskar@gmail.com';
const LAST_UPDATED = 'May 2026';

// ============================================
// POLICY SECTIONS DATA
// ============================================
const POLICY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us, including your name, email, phone number, and any other information you choose to share while using ${APP_NAME}.`,
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to provide and improve our services, communicate with you, personalize your experience, and ensure the security of our platform.',
  },
  {
    title: '3. Information Sharing',
    body: 'We do not share your personal information with third parties except as described in this policy, or when required by law. We may share data with trusted service providers who assist us in operating our app.',
  },
  {
    title: '4. Data Security',
    body: 'We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, correct, or delete your personal information at any time. You may also request a copy of the data we hold about you by contacting us.',
  },
  {
    title: "6. Children's Privacy",
    body: `Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children. If we discover that a child under 13 has provided us with personal data, we will delete it immediately.`,
  },
  {
    title: '7. Cookies & Tracking Technologies',
    body: 'We may use cookies, analytics, and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookies through your device settings.',
  },
  {
    title: '8. Third-Party Services',
    body: `${APP_NAME} may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.`,
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.',
  },
  {
    title: '10. Contact Us',
    body: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at ${CONTACT_EMAIL}.`,
  },
];

// ============================================
// COMPONENT
// ============================================
const PrivacyPolicyScreen = ({ navigation }) => {
  // Email link handler
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`).catch((err) =>
      console.warn('Failed to open email:', err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ===== Header with Back Button ===== */}
      {navigation && (
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Privacy Policy
          </Text>
          <Text style={styles.company}>{COMPANY_NAME}</Text>
          <Text style={styles.lastUpdated}>Last updated: {LAST_UPDATED}</Text>
        </View>

        {/* ===== Intro ===== */}
        <View style={styles.introBox}>
          <Text style={styles.introText}>
            This Privacy Policy describes how {APP_NAME} ("we", "us", or "our")
            collects, uses, and protects your personal information when you use
            our application and services. By using {APP_NAME}, you agree to the
            practices described in this policy.
          </Text>
        </View>

        {/* ===== Dynamic Sections ===== */}
        {POLICY_SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.bodyText}>{section.body}</Text>

            {/* Contact section ke niche email link */}
            {section.title === '10. Contact Us' && (
              <TouchableOpacity
                onPress={handleEmailPress}
                style={styles.emailButton}
                accessibilityRole="link"
                accessibilityLabel={`Email us at ${CONTACT_EMAIL}`}
              >
                <Text style={styles.emailText}>✉ {CONTACT_EMAIL}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* ===== Footer ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </Text>
          <Text style={styles.footerSubText}>
            Your privacy matters to us. 💗
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFE4E9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Nav bar
  navBar: {
    backgroundColor: '#FFE4E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#D6336C',
    fontWeight: '600',
  },

  // Header
  header: {
    padding: 20,
    backgroundColor: '#FFE4E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  company: {
    fontSize: 14,
    color: '#D6336C',
    fontWeight: '600',
    marginTop: 6,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  // Intro
  introBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D6336C',
    // Android shadow
    elevation: 2,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  introText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D6336C',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
  },

  // Email button
  emailButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFE4E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#D6336C',
    fontWeight: '600',
  },

  // Footer
  footer: {
    marginTop: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFE4E9',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 12,
    color: '#D6336C',
    marginTop: 6,
    fontWeight: '600',
  },
});

export default PrivacyPolicyScreen;