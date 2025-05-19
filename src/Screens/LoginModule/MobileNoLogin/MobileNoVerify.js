import React, {useState} from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import OtpInput from '../../../Components/otpInput/OtpInput';
import {Images} from '../../../Assets/Images';
import strings from '../../../../localization';
import {Fonts} from '../../../Constants/Fonts';
import {scale} from '../../../Constants/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Instance} from '../../../API/Instance';

export default function MobileNoVerify({navigation, route}) {
  const {details, mobile} = route.params;

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const onConfirm = async () => {
    const payload = {
      sessionId: details,
      otp: otp,
      mobile: mobile,
    };

    try {
      const response = await Instance.post(
        '/api/users/mobile-otp-verify',
        payload,
      );

      if (response.data?.success && response.data?.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        console.log('Token saved:', response.data.token);
        navigation.navigate('TabNavigator');
      } else {
        console.warn('Verification failed:', response.data?.msg);
      }
    } catch (error) {
      console.error('API error:', error.message);
    }
  };
  const resendOtp = () => {
    setTimeLeft(60);
    console.log('OTP resent');
  };

  const resetTimer = () => setTimeLeft(0);

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#A6D1E6']}
      style={styles.container}>
      <SafeAreaView />
      <CustomHeader title={strings.verifyEmailHeader} showBackButton />

      <KeyboardAwareScrollView
        style={styles.marginView}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Animated.Image
              style={styles.logoImage}
              resizeMode="contain"
              source={Images.Logo}
              sharedTransitionTag="Tag"
            />
            <Text style={styles.phoneText}>Verify Your Mobile No</Text>
            <Text style={styles.phoneSubText}>
              We sent the OTP to +91 {mobile}
            </Text>

            <OtpInput otp={otp} setOtp={setOtp} />

            {timeLeft > 0 ? (
              <Text style={styles.otpText}>
                Resend OTP in {timeLeft} seconds...
              </Text>
            ) : (
              <Text style={styles.phoneNumberText} onPress={resendOtp}>
                {strings.ResendOTP}
              </Text>
            )}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  marginView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingHorizontal: metrics.hp2,
    paddingBottom: 40,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: metrics.hp5,
  },
  logoImage: {
    width: '80%',
    height: metrics.hp13,
    marginBottom: metrics.hp3,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 22,
    textAlign: 'center',
    color: AllColors.black,
    marginTop: metrics.hp3,
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 16,
    textAlign: 'center',
    color: AllColors.subText,
    marginTop: metrics.hp1_5,
  },
  phoneNumberText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: metrics.hp2,
    textDecorationLine: 'underline',
  },
  otpText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 16,
    textAlign: 'center',
    marginTop: metrics.hp2,
    color: AllColors.subText,
  },
  buttonContainer: {
    height: metrics.hp6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AllColors.text600,
    borderRadius: metrics.hp1,
    marginTop: metrics.hp3,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: Fonts.AfacadBold,
  },
});
