import {CommonActions, NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Images} from '../../../Assets/Images';
import {AllColors} from '../../../Constants/COLORS';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {styles} from './styles';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import metrics from '../../../Constants/Metrics';
import strings from '../../../../localization';
import OtpInput from '../../../Components/otpInput/OtpInput';
import axios from 'axios';  // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {scale} from '../../../Constants/Scalling';
import {Instance} from '../../../API/Instance';

interface LoginScreenProps {
  navigation: NavigationProp<any, any>;
}

const VerifyOtp = (props: LoginScreenProps) => {
  const email = props.route.params.email;

  const [otp, setOtp] = useState<Array<string>>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setIsRunning(true);
  };

  const onConfirm = async () => {
    const otpCode = otp.join('');
    if (!isNaN(Number(otpCode))) {
      console.log('OTP:', otpCode);
      setIsLoading(true);

      try {
        const response = await Instance.post('/api/users/verify-otp', {
          email: email, 
          otp: otpCode, 
        });
        if (response.data && response.data.token) {
          await AsyncStorage.setItem('userToken', response.data.token);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 3,
              routes: [{name: 'TabNavigator'}],
            }),
          );
        } else {
          Alert.alert('Error', 'Invalid OTP or some other issue');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('The OTP must be a number.');
      setIsLoading(false);
    }
  };

  const resetTimer = () => {
    setTimeLeft(30);
    setIsRunning(true);
  };

  const resendOtp = async () => {
    setIsLoading(true); 

    try {
      const response = await Instance.post('/api/users/sign-in', {
        email: email,
      });

      if (response.data && response.data.message) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
        resetTimer();  
      } else {
        Alert.alert('Error', 'Unable to resend OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Something went wrong while resending OTP.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <LinearGradient colors={['#fff', '#fff', '#A6D1E6']} style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <KeyboardAwareScrollView
        style={styles.marginView}
        enableOnAndroid={true}
        extraScrollHeight={0}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <Animated.Image
              style={styles.logoImage}
              resizeMode="contain"
              source={Images.Logo}
              sharedTransitionTag="Tag"
            />
            <Text style={styles.phoneText}>{strings.verifyEmail} {email}</Text>
            <Text style={styles.phoneSubText}>{strings.wesentOTP}</Text>

            {/* Resend OTP Button */}
            <Text
              style={styles.phoneNumberText}
              onPress={resendOtp}>
              {strings.ResendOTP}
            </Text>

            <OtpInput otp={otp} setOtp={setOtp} />

            {timeLeft === 0 ? (
              <Text
                style={styles.otpTextWhite}
                onPress={() => resetTimer()} />
            ) : (
              <Text style={styles.otpText}>
                {`Resend OTP in ${timeLeft} Seconds...`}
              </Text>
            )}

            <TouchableOpacity
              style={{
                height: '10%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: AllColors.text600,
                borderRadius: metrics.hp2,
                marginTop: scale(25),
              }}
              onPress={onConfirm}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{strings.signup}</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default VerifyOtp;
