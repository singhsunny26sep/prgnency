import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import { CustomHeader } from '../../Components/CustomHeader/CutsomHeader';
import { moderateScale, scale } from '../../Constants/Scalling';
import { Fonts } from '../../Constants/Fonts';

export default function Terms_Condition({navigation}) {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
        <CustomHeader
          type="back"
          screenName="Terms & Conditions"
          onPressBack={() => {
            navigation.goBack();
          }}
        />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Hiranya Garbha! These Terms and Conditions govern your use
          of the app. By accessing or using this app, you agree to comply with
          these terms. If you do not agree with these terms, please do not use
          the app.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          As a user of Hiranya Garbha, you are responsible for maintaining the
          confidentiality of your account information and for all activities
          under your account. You must not use the app for any unlawful
          purposes.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
        <Text style={styles.text}>
          We value your privacy. Please refer to our Privacy Policy to
          understand how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>4. Content Ownership</Text>
        <Text style={styles.text}>
          All content, features, and functionality on the app are owned by
          Hiranya Garbha. You may not copy, modify, or distribute the content
          without prior consent.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.text}>
          Hiranya Garbha is not liable for any damages arising from your use of
          the app. This includes, but is not limited to, any direct, indirect,
          or consequential damages.
        </Text>
        <Text style={styles.sectionTitle}>6. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to modify or discontinue the app or these terms
          at any time. Any changes will be posted here, and continued use of the
          app means acceptance of those changes.
        </Text>

        <Text style={styles.sectionTitle}>7. Governing Law</Text>
        <Text style={styles.text}>
          These Terms and Conditions are governed by the laws of the
          jurisdiction where Hiranya Garbha operates.
        </Text>

        <Text style={styles.footer}>
          If you have any questions or concerns, please contact us at
          support@hiranyagarbha.com.
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
