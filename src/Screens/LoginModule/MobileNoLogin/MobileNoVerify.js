import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
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
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

const onConfirm = async () => {
  if (!otp) {
    console.warn('OTP is empty');
    return;
  }

  setLoading(true);

  const formattedOtp = Array.isArray(otp) ? otp.join('') : otp;

  const payload = {
    sessionId: details,
    otp: formattedOtp,
    mobile: mobile,
     fcmToken: "jnxjwsscwdiicwdic"
  };

  console.log('🔼 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await Instance.put('/api/users/verify-otp-mobile', payload);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    console.log(response)
    if (response.data?.success && response.data?.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      console.log('Token saved to AsyncStorage:', response.data.token);
      navigation.navigate('TabNavigator');
    } else {
      console.warn('Verification failed:', response.data?.msg || 'Unknown error');
      alert(response.data?.msg || 'OTP verification failed. Please try again.');
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from API:', error.request);
    } else {
      console.error('Error in request setup:', error.message);
    }
  } finally {
    setLoading(false);
  }
};

  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await Instance.post('/api/users/login-with-mobile', {
        mobile: mobile,
      });

      if (response.data.success) {
        setTimeLeft(60);
        console.log('OTP resent successfully');
      } else {
        console.warn('Failed to resend OTP:', response.data.msg || 'Unknown error');
      }
    } catch (error) {
      console.error('Error resending OTP:', error.response?.data || error.message);
    } finally {
      setResendLoading(false);
    }
  };

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
              <TouchableOpacity onPress={resendOtp} disabled={resendLoading}>
                {resendLoading ? (
                  <ActivityIndicator color="#4A90E2" size="small" />
                ) : (
                  <Text style={styles.phoneNumberText}>
                    {strings.ResendOTP}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={onConfirm}>
              {loading ? (
                <ActivityIndicator color="#FFF" size='small'/>
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
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
