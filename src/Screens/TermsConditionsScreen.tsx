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
const GOVERNING_LAW = 'India'; // 👈 apna jurisdiction (e.g. India, California, USA)

// ============================================
// TERMS SECTIONS DATA
// ============================================
const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using ${APP_NAME}, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.`,
  },
  {
    title: '2. Use of Services',
    body: `You agree to use ${APP_NAME} only for its intended purpose and in accordance with all applicable laws and regulations. You must not misuse, disrupt, or attempt to gain unauthorized access to our services.`,
  },
  {
    title: '3. Account Registration',
    body: 'You must provide accurate, current, and complete information when registering for an account and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.',
  },
  {
    title: '4. User Content',
    body: `You retain ownership of any content you submit through ${APP_NAME}. However, by posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute it as needed to operate the service.`,
  },
  {
    title: '5. Intellectual Property',
    body: `All content, trademarks, logos, and other intellectual property displayed on ${APP_NAME} are owned by ${COMPANY_NAME} or its licensors. You may not copy, modify, or distribute any part of our services without prior written permission.`,
  },
  {
    title: '6. Prohibited Activities',
    body: 'You agree not to: (a) violate any laws; (b) infringe on intellectual property rights; (c) upload malicious code; (d) harass or harm other users; (e) attempt to reverse-engineer our services; or (f) use our services for fraudulent purposes.',
  },
  {
    title: '7. Payments & Subscriptions',
    body: `If ${APP_NAME} offers paid features, you agree to pay all applicable fees. Subscriptions may auto-renew unless canceled before the renewal date. Refunds are subject to our refund policy.`,
  },
  {
    title: '8. Termination',
    body: `We reserve the right to suspend or terminate your account at any time, with or without notice, if you violate these Terms. Upon termination, your right to use ${APP_NAME} will immediately cease.`,
  },
  {
    title: '9. Limitation of Liability',
    body: `To the maximum extent permitted by law, ${COMPANY_NAME} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of ${APP_NAME}.`,
  },
  {
    title: '10. Disclaimer of Warranties',
    body: `${APP_NAME} is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted or error-free.`,
  },
  {
    title: '11. Changes to Terms',
    body: 'We may update these Terms and Conditions from time to time. Continued use of our services after changes are posted constitutes your acceptance of the revised terms.',
  },
  {
    title: '12. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with the laws of ${GOVERNING_LAW}, without regard to its conflict of law provisions.`,
  },
  {
    title: '13. Contact Us',
    body: `If you have any questions or concerns about these Terms and Conditions, please contact us at ${CONTACT_EMAIL}.`,
  },
];

// ============================================
// COMPONENT
// ============================================
const TermsConditionsScreen = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`).catch((err) =>
      console.warn('Failed to open email:', err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ===== Nav Bar with Back ===== */}
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
            Terms & Conditions
          </Text>
          <Text style={styles.company}>{COMPANY_NAME}</Text>
          <Text style={styles.lastUpdated}>Last updated: {LAST_UPDATED}</Text>
        </View>

        {/* ===== Intro ===== */}
        <View style={styles.introBox}>
          <Text style={styles.introText}>
            Please read these Terms and Conditions carefully before using{' '}
            {APP_NAME}. These terms govern your access to and use of our
            application and services.
          </Text>
        </View>

        {/* ===== Dynamic Sections ===== */}
        {TERMS_SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.bodyText}>{section.body}</Text>

            {/* Contact section ke niche email link */}
            {section.title === '13. Contact Us' && (
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
            Thank you for using {APP_NAME}. 💗
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
    elevation: 2,
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

export default TermsConditionsScreen;