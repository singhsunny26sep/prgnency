import React, {useState} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {Images} from '../../../Assets/Images';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import strings from '../../../../localization';
import {Container} from '../../../Components/Container/Container';
import { Fonts } from '../../../Constants/Fonts';
import { moderateScale } from '../../../Constants/Scalling';

const LoginWithOtp = props => {
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [userMobileNumberHasError, setUserMobileNumberHasError] = useState(false);
  const [userMobileNumberErrorString, setUserMobileNumberErrorString] = useState('');


  function onChangeMobileNumber(text) {
    if (text) {
      setUserMobileNumber(text);
      const isValid =
        /^[A-Z0-9.!#$'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(text)
      setUserMobileNumberHasError(!isValid);
      setUserMobileNumberErrorString(isValid ? '' : strings.pleaseValidEMail);
    } else {
      setUserMobileNumber('');
      setUserMobileNumberHasError(false);
      setUserMobileNumberErrorString('');
    }
  }

 

  function sendOTP() {
    props.navigation.navigate('LoginOTP', {
      CountryCode: '+91',
      Number: userMobileNumber,
    });
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <LinearGradient
        colors={['#fff', '#fff', '#A6D1E6']}
        style={styles.container}>
        <SafeAreaView />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Image
              source={Images.Logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{strings.loginwithmobile}</Text>
            <Text style={styles.subtitle}>{strings.addPhoneNumber}</Text>

            <Text style={styles.label}>{strings.Email}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholder={strings.enterYourEmail}
                placeholderTextColor="#999"
                value={userMobileNumber}
                onChangeText={onChangeMobileNumber}
              />
            </View>
            {userMobileNumberHasError && (
              <Text style={styles.error}>{userMobileNumberErrorString}</Text>
            )}
         
            <LinearGradient
              colors={['#4A90E2', '#6FA7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.button}>
              <TouchableOpacity
                style={{
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={sendOTP}>
                <Text style={styles.buttonText}>{strings.sendotp}</Text>
              </TouchableOpacity>
            </LinearGradient>
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
    fontSize:moderateScale(17),
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    fontFamily: Fonts.AfacadMedium,
  },
  label: {
    fontSize:moderateScale(17),
    fontFamily: Fonts.AfacadBold,
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
    color: '#555',
    marginRight: 10,
    fontSize:moderateScale(17),
    fontFamily: Fonts.AfacadBold,
  },
  input: {
    height: metrics.hp6,
    fontSize: 16,
    color: '#333',
    fontFamily: Fonts.AfacadBold,
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
});

export default LoginWithOtp;
