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
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../../Assets/Images';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import strings from '../../../../localization';
import { Container } from '../../../Components/Container/Container';
import { Fonts } from '../../../Constants/Fonts';
import axios from 'axios'; // Import axios
import { Instance } from '../../../API/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale, scale } from '../../../Constants/Scalling';

interface LoginScreenProps {
  route: { params: any };
  navigation: NavigationProp<any, any>;
}

const LoginScreen = (props: LoginScreenProps) => {
  const [email, setEmail] = useState<string>(''); 
  const [emailHasError, setEmailHasError] = useState(false); 
  const [emailErrorString, setEmailErrorString] = useState(''); 
  
  const [userPassword, setUserPassword] = useState<string>(''); 
  const [userPasswordHasError, setUserPasswordHasError] = useState(false); 
  const [userPasswordErrorString, setUserPasswordErrorString] = useState(''); 
  
  const [isLoading, setIsLoading] = useState(false); 
  const [loginError, setLoginError] = useState(''); 

  function onChangeEmail(text: string) {
    setEmail(text);
    const isValid = /^[A-Z0-9.!#$'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(text);
    setEmailHasError(!isValid);
    setEmailErrorString(isValid ? '' : strings.pleaseValidEMail);
  }

  function onChangePassword(text: string) {
    setUserPassword(text);
    const isValid = text.length >= 6;
    setUserPasswordHasError(!isValid);
    setUserPasswordErrorString(isValid ? '' : strings.password6Digit);
  }

  async function handleLogin() {
    if (emailHasError || userPasswordHasError) {
      return;
    }
  
    setIsLoading(true);
    setLoginError('');
  
    const loginData = {
      email: email,
      password: userPassword,
    };
  
    try {
      const response = await Instance.post('/api/users/login', loginData);
      if (response.data.success) {
        const token = response.data.token;
        console.log('Login successful, token:', token);
        await AsyncStorage.setItem('userToken', token);
        props.navigation.navigate('TabNavigator');
      } else {
        setLoginError('Invalid login credentials');
      }
    } catch (error) {
      setLoginError('An error occurred while logging in. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <LinearGradient colors={['#fff', '#fff', '#A6D1E6']} style={styles.container}>
        <SafeAreaView />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Image source={Images.Logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>
              {props.route.params.isPassword ? strings.loginwithpass : strings.loginwithmobile}
            </Text>
            <Text style={styles.subtitle}>
              {props.route.params.isPassword ? strings.enterPassword : strings.addPhoneNumber}
            </Text>

            <Text style={styles.label}>{strings.Email}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholder={strings.enterYourEmail}
                placeholderTextColor="#999"
                value={email}
                onChangeText={onChangeEmail} 
              />
            </View>
            {emailHasError && (
              <Text style={styles.error}>{emailErrorString}</Text> 
            )}

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
                  {userPasswordHasError && (
                    <Text style={styles.error}>{userPasswordErrorString}</Text>
                  )}
                </View>
              </View>
            )}

            <LinearGradient
              colors={['#4A90E2', '#6FA7FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}>
              <TouchableOpacity
                style={{
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleLogin}>
              {isLoading ? (
      <ActivityIndicator size="small" color="white"  />
    ) : (
      <Text style={styles.buttonText}>
        {strings.login }
      </Text>
    )}
              </TouchableOpacity>
            </LinearGradient>

            {loginError && <Text style={styles.error}>{loginError}</Text>}
            <TouchableOpacity onPress={()=>props.navigation.navigate('ForgotPassword')}>
                <Text style={styles.ForgotPasstxt}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: metrics.hp15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.AfacadBold,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    fontFamily: Fonts.AfacadMedium,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.AfacadMedium,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  countryCode: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
  },
  input: {
    height: metrics.hp6,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 12,
    color: '#E74C3C',
    marginBottom: 10,
    fontFamily: Fonts.AfacadMedium,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    height: metrics.hp7,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
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
  ForgotPasstxt:{
    textAlign:"right",
    marginTop:scale(10),
    marginRight:scale(5),
    fontFamily:Fonts.AfacadBold,
    textDecorationLine:'underline',
    fontSize:moderateScale(15)
  }

});

export default LoginScreen;
