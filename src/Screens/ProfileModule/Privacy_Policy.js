import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import { moderateScale, scale } from '../../Constants/Scalling';
import { Fonts } from '../../Constants/Fonts';

export default function  Privacy_Policy({navigation}) {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Privacy Policy"
        onPressBack={() => {
          navigation.goBack();
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Hiranya Garbha. Your privacy is important to us. This
          Privacy Policy explains how we collect, use, and protect your personal
          information when you use our app.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect the following types of information:
          {'\n'}- Personal Identification Information: Name, email address, etc.
          {'\n'}- Usage Data: How you interact with the app, features used,
          crash reports, etc.
          {'\n'}- Device Information: Device type, OS version, and other
          device-specific data.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.text}>
          The information we collect is used for:
          {'\n'}- Providing and improving our services.
          {'\n'}- Communicating with you about updates, features, and
          promotions.
          {'\n'}- Analyzing app usage to improve performance.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell or rent your personal data to third parties. However,
          we may share your data with third parties under the following
          circumstances:
          {'\n'}- With service providers who assist in operating the app.
          {'\n'}- When required by law or to protect the rights of Hiranya
          Garbha.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We implement a variety of security measures to maintain the safety of
          your personal data. However, no data transmission over the internet is
          completely secure. We cannot guarantee the absolute security of your
          data.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Choices</Text>
        <Text style={styles.text}>
          You have the right to:
          {'\n'}- Access, update, or delete your personal information.
          {'\n'}- Opt-out of marketing communications.
        </Text>

        <Text style={styles.sectionTitle}>
          7. Changes to this Privacy Policy
        </Text>
        <Text style={styles.text}>
          We reserve the right to update or modify this Privacy Policy at any
          time. Any changes will be posted on this page, and the date of the
          last update will be shown at the top of the page.
        </Text>

        <Text style={styles.footer}>
          If you have any questions about this Privacy Policy, please contact us
          at support@hiranyagarbha.com.
        </Text>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: AllColors.white,
    marginHorizontal:scale(10)
  },
  sectionTitle: {
    fontSize:moderateScale(20),
    fontFamily:Fonts.AfacadBold,
    color: AllColors.darkGrey,
    marginTop:scale(15),
    marginBottom:scale(5),
  },
  text: {
    fontSize:moderateScale(16),
    color: AllColors.black,
    lineHeight:scale(22),
    textAlign:'justify',
    fontFamily:Fonts.AfacadRegular
  },
  footer: {
    fontSize:moderateScale(14),
    color: AllColors.grey,
    marginTop:scale (30),
    textAlign: 'center',
    fontFamily:Fonts.AfacadMedium
  },
});
