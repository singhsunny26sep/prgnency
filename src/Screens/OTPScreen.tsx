import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';
import { useAuth } from '../Context/AuthContext';

const API_URL = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha';

type OTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTP'>;
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const { login } = useAuth();
  const { mobile, sessionId } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert(strings.alertCompleteOtp || 'त्रुटि', strings.alertCompleteOtp || 'कृपया पूरा 6-अंकों का ओटीपी दर्ज करें');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp-mobile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: parseInt(mobile, 10),
          otp: otpString,
          sessionId: sessionId,
          role: 'user',
          fcmToken: 'dummy-fcm-token',
          loginType: 'mobile',
          currentScreen: 'LANDING',
        }),
      });
      const data = await response.json();
      console.log('=== OTP Verification API Response ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Full response data:', JSON.stringify(data, null, 2));
      console.log('Response success:', data.success);
      console.log('Response message:', data.message);
      console.log('User data:', data.data?.user);
      console.log('Token field:', data.data?.token);
      console.log('JWT field:', data.data?.jwt);
      console.log('SessionId field:', data.data?.sessionId);
      console.log('=====================================');
      if (response.ok && data.success) {
        const userId = data.data?.user?.id || data.data?.user?._id;
        const userData = {
          id: userId,
          _id: userId,
          mobile: mobile,
          name: data.data?.user?.name,
          email: data.data?.user?.email,
          sessionId: data.data?.sessionId || sessionId,
        };
        
        const allTokenFields = {
          dataToken: data.data?.token,
          dataJwt: data.data?.jwt,
          dataSessionId: data.data?.sessionId,
          sessionIdParam: sessionId,
        };
        
        console.log('All available token fields:', allTokenFields);
        
        let authToken = '';
        
        if (data.data?.token && (data.data?.token.startsWith('eyJ') || data.data?.token.includes('.'))) {
          authToken = data.data.token.trim();
          console.log('Using JWT token from data.data.token');
        } else if (data.data?.jwt && (data.data?.jwt.startsWith('eyJ') || data.data?.jwt.includes('.'))) {
          authToken = data.data.jwt.trim();
          console.log('Using JWT token from data.data.jwt');
        } else if (data.data?.sessionId) {
          console.warn('WARNING: No JWT token found in response. Using data.data.sessionId instead:', data.data.sessionId);
          authToken = data.data.sessionId.trim();
        } else if (sessionId) {
          console.warn('WARNING: No JWT token found in response. Using sessionId param instead:', sessionId);
          authToken = sessionId.trim();
        } else {
          console.error('ERROR: No token found in OTP response');
          Alert.alert('Error', 'Authentication failed. Please try again.');
          setLoading(false);
          return;
        }
        
        console.log('Final authToken being stored:', authToken);
        console.log('Token length:', authToken.length);
        console.log('Token starts with eyJ (JWT):', authToken.startsWith('eyJ'));
        console.log('User ID selected:', userId);
        
        await login(userData, authToken);
        navigation.navigate('MainTabs');
      } else {
        Alert.alert(
          strings.alertError || 'त्रुटि',
          data.message || 'ओटीपी सत्यापित करने में विफल रहा। कृपया पुनः प्रयास करें।'
        );
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert(
        strings.alertError || 'त्रुटि',
        'सर्वर से जुड़ने में विफल रहा। कृपया अपना इंटरनेट जाँचें।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{strings.verifyOtpTitle || 'ओटीपी सत्यापित करें'}</Text>
        <Text style={styles.subtitle}>{strings.otpSubtitle?.replace('{mobile}', mobile) || `+91 ${mobile} पर भेजे गए 6-अंकों का कोड दर्ज करें`}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? (strings.verifyingOtp || 'सत्यापित हो रहे हैं...') : (strings.verifyOtpButton || 'ओटीपी सत्यापित करें')}</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>{strings.codeNotReceived || 'कोड नहीं मिला? '}</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              {strings.otpResendTimer?.replace('{timer}', timer.toString()) || `फिर से भेजें ${timer}s`}
            </Text>
          ) : (
            <TouchableOpacity>
              <Text style={styles.resendLink}>{strings.resendOtp || 'फिर से भेजें'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  otpInput: {
    width: 50, height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    fontSize: 20, textAlign: 'center', backgroundColor: '#fff',
  },
  otpInputFilled: { borderColor: '#D6336C' },
  button: { backgroundColor: '#D6336C', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendText: { fontSize: 14, color: '#666' },
  timerText: { fontSize: 14, color: '#999' },
  resendLink: { fontSize: 14, color: '#D6336C', fontWeight: '500' },
});

export default OTPScreen;
