import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator, // Added ScrollView
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../../Assets/Images';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import strings from '../../../../localization';
import { Container } from '../../../Components/Container/Container';
import { Fonts } from '../../../Constants/Fonts';
import { moderateScale, scale } from '../../../Constants/Scalling';
import axios from 'axios';
import { Instance } from '../../../API/Instance';

interface Signupprops {
  route: { params: any };
  navigation: NavigationProp<any, any>;
}

const Signup = (props: Signupprops) => {
  const [userFullName, setUserFullName] = useState<string>(''); // Added full name state
  const [userMobileNumber, setUserMobileNumber] = useState<string>(''); 
  const [userMobileNumberError, setUserMobileNumberError] = useState<string>('');
  
  const [userEmail, setUserEmail] = useState<string>('');  // Added email state
  const [userEmailError, setUserEmailError] = useState<string>('');  // Added email error state

  const [userPassword, setUserPassword] = useState<string>('');
  const [userPasswordError, setUserPasswordError] = useState<string>('');
  
  const [userLMP, setUserLMP] = useState<string>('');
  const [userLMPError, setUserLMPError] = useState<string>('');
  
  const [userEDD, setUserEDD] = useState<string>('');
  const [userEDDError, setUserEDDError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); 

  // Full Name Validation
  function onChangeFullName(text: string) {
    setUserFullName(text);
  }

  // Mobile Number Validation
  function onChangeMobileNumber(text: string) {
    setUserMobileNumber(text);
    const isValid =
      /^[A-Z0-9.!#$'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(text); 
    setUserMobileNumberError(isValid ? '' : strings.pleaseValidEMail);
  }

  // Email Validation
  function onChangeEmail(text: string) {
    setUserEmail(text);
    const isValid =
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(text);  // Email regex pattern
    setUserEmailError(isValid ? '' : strings.pleaseValidEMail);
  }

  // Password Validation
  function onChangePassword(text: string) {
    setUserPassword(text);
    setUserPasswordError(text.length >= 6 ? '' : strings.password6Digit);
  }

  // LMP Validation
  function onChangeLMP(text: string) {
    setUserLMP(text);
    setUserLMPError(text ? '' : "Please enter LMP date"); 
  }

  // EDD Validation
  function onChangeEDD(text: string) {
    setUserEDD(text);
    setUserEDDError(text ? '' : "Please enter EDD date"); 
  }

  async function registerUser() {
    setIsLoading(true);
    const requestBody = {
      email: userEmail,
      password: userPassword,
      name: userFullName,
      lmp: userLMP,
      edd: userEDD,
      mobile: userMobileNumber,
    };
    try {
      const response = await Instance.post('/api/users/register', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response:', response);
  
      if (response.status === 200 || response.status === 201) {
        console.log('Navigating to VerifyOtp');
        props.navigation.navigate('VerifyOtp', {email:userEmail});
      } else {
        console.log('Error registering user:', response.data.message);
      }
      
    } catch (error) {
      console.error('API call error:', error.response ? error.response.data : error.message);
    }
    finally {
      setIsLoading(false); 
    }
  }
  

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}
    >
      <LinearGradient
        colors={['#fff', '#fff', '#A6D1E6']}
        style={styles.container}
      >
        <SafeAreaView />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.content}>
            <Image
              source={Images.Logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              {props.route.params.isPassword
                ? strings.signup
                : strings.loginwithmobile}
            </Text>
            <Text style={styles.subtitle}>
              {props.route.params.isPassword
                ? strings.enterPassword
                : strings.addPhoneNumber}
            </Text>

            {/* Full Name */}
            <Text style={styles.label}>{strings.fullname}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={strings.enterYourFullName}
                placeholderTextColor="#999"
                value={userFullName}
                onChangeText={onChangeFullName}
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>{strings.Email}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholder={strings.enterYourEmail}
                placeholderTextColor="#999"
                value={userEmail}
                onChangeText={onChangeEmail}
              />
            </View>
            {userEmailError && (
              <Text style={styles.error}>{userEmailError}</Text>
            )}

            <Text style={styles.label}>{strings.userMo}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={strings.enterusermo}
                placeholderTextColor="#999"
                value={userMobileNumber}
                onChangeText={onChangeMobileNumber}
              />
            </View>
           

            <Text style={styles.label}>LMP</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter LMP date (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={userLMP}
                onChangeText={onChangeLMP}
              />
            </View>
            {userLMPError && (
              <Text style={styles.error}>{userLMPError}</Text>
            )}

            <Text style={styles.label}>EDD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter EDD date (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={userEDD}
                onChangeText={onChangeEDD}
              />
            </View>
            {userEDDError && (
              <Text style={styles.error}>{userEDDError}</Text>
            )}

            {/* Password (Only for Password Mode) */}
            {props.route.params.isPassword && (
              <View>
                <Text style={styles.label}>{strings.Password}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder={strings.enterYourPass}
                    placeholderTextColor="#999"
                    value={userPassword}
                    onChangeText={onChangePassword}
                  />
                  {userPasswordError && (
                    <Text style={styles.error}>{userPasswordError}</Text>
                  )}
                </View>
              </View>
            )}

<LinearGradient
  colors={['#4A90E2', '#6FA7FF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.button}
>
  <TouchableOpacity
    style={{
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={registerUser}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color="white"  />
    ) : (
      <Text style={styles.buttonText}>
        {props.route.params.isPassword ? strings.signup : strings.sendotp}
      </Text>
    )}
  </TouchableOpacity>
</LinearGradient>


            {props.route.params.isPassword && (
              <Text style={styles.link}>
                Try another way?{' '}
                <Text style={styles.linkHighlight}>Log In with WhatsApp</Text>
              </Text>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </Container>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, 
  },
  logo: {
    height: metrics.hp15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: Fonts.AfacadBold,
    textAlign: 'center',
    marginBottom: scale(10),
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    fontFamily: Fonts.AfacadMedium,
    marginHorizontal: scale(15),
  },
  label: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.AfacadMedium,
    marginBottom: scale(8),
    color: '#333',
    marginHorizontal: scale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    marginHorizontal: scale(15),
  },
  input: {
    height: metrics.hp6,
    fontSize: 16,
    color: '#333',
    flex: 1, 
  },
  error: {
    fontSize: 12,
    color: '#E74C3C',
    bottom: 10,
    fontFamily: Fonts.AfacadMedium,
    marginHorizontal: scale(20),
  },
  button: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    height: metrics.hp7, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: scale(15),
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: Fonts.AfacadBold,
  },
  link: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  linkHighlight: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: 10, // Adjust the space between the button and the loader
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#999',
  },
});
