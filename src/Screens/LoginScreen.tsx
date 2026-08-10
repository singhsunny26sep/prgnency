import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';
import { useAuth } from '../Context/AuthContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const API_URL = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha';

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      Alert.alert(strings.alertValidMobile || 'त्रुटि', strings.alertValidMobile || 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/loginOrSignin-with-mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: parseInt(mobile, 10),
          isPermissionGiven: true,
        }),
      });
      const data = await response.json();
      console.log('Login API response:', data);
      if (response.ok && data.success) {
        const sessionId = data.data?.otpData?.Details || null;
        navigation.navigate('OTP', { mobile, sessionId });
      } else {
        Alert.alert(
          strings.alertError || 'त्रुटि',
          data.message || 'OTP भेजने में विफल रहा। कृपया पुनः प्रयास करें।'
        );
      }
    } catch (error: any) {
      console.error('Login API error:', error);
      Alert.alert(
        strings.alertError || 'त्रुटि',
        'सर्वर से जुड़ने में विफल रहा। कृपया अपना इंटरनेट जाँचें।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
        
          <Image resizeMode='contain' style={styles.logo} source={require('../assets/img/LOGO.png')}  />
          <Text style={styles.appName}>{strings.appName || 'हिरण्यगर्भ संस्कार'}</Text>
        </View>

        <Text style={styles.title}>{strings.loginTitle || 'स्वागत है'}</Text>
        <Text style={styles.subtitle}>{strings.loginSubtitle || 'भारत का सबसे विश्वसनीय ऑनलाइन गर्भसंस्कार समुदाय'}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{strings.mobileLabel || 'मोबाइल नंबर'}</Text>
          <View style={styles.phoneInput}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder={strings.mobilePlaceholder || 'मोबाइल नंबर दर्ज करें'}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? (strings.sendingOtp || 'भेज रहे हैं...') : (strings.sendOtpButton || 'ओटीपी भेजें')}</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{strings.appBenefits || 'ऐप के फायदे:'}</Text>
          <Text style={styles.infoItem}>• {strings.benefit1 || 'गर्भसंस्कार वीडियो लेसन'}</Text>
          <Text style={styles.infoItem}>• {strings.benefit2 || 'साप्ताहिक गर्भावस्था टिप्स'}</Text>
          <Text style={styles.infoItem}>• {strings.benefit3 || 'बच्चे के विकास की जानकारी'}</Text>
          <Text style={styles.infoItem}>• {strings.benefit4 || 'प्रीमियम गर्भसंस्कार प्लान'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 60 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 60 ,height: 60, width: 80, marginBottom: 10 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#D6336C', marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  formContainer: { marginBottom: 24 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500' },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  countryCode: { fontSize: 16, color: '#333', fontWeight: '500', marginRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 16, color: '#333' },
  button: {
    backgroundColor: '#D6336C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  infoBox: {
    backgroundColor: '#FFE4E9',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#D6336C', marginBottom: 10 },
  infoItem: { fontSize: 13, color: '#666', marginBottom: 5 },
});

export default LoginScreen;
