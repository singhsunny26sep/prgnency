import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import {Fonts} from '../../../Constants/Fonts';
import OtpInput from '../../../Components/otpInput/OtpInput';
import {Container} from '../../../Components/Container/Container';

export default function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const validateEmail = email => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleNext = () => {
    if (step === 1) {
      if (email && validateEmail(email)) {
        setStep(2);
      } else {
        alert('Please enter a valid email address');
      }
    } else if (step === 2) {
      if (otp) {
        setStep(3);
      } else {
        alert('Please enter the OTP');
      }
    } else if (step === 3) {
      if (newPassword) {
        alert('Password updated successfully');
        navigation.navigate('LoginDetails');
      } else {
        alert('Please enter a new password');
      }
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/004/112/232/non_2x/forgot-password-and-account-login-for-web-page-protection-security-key-access-system-in-smartphone-or-computer-flat-illustration-vector.jpg',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>
          {step === 1
            ? 'Forgot Password'
            : step === 2
            ? 'Enter OTP'
            : 'Update Password'}
        </Text>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.infoText}>
            Please enter your Email address. We'll send you an OTP to verify.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.textInput}
            />
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.infoText}>
            Enter the OTP sent to your Email address. Please check your Whatsapp
          </Text>
          <View style={{marginTop: 15, marginBottom: 35}}>
            <OtpInput otp={otp} setOtp={setOtp} />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.infoText}>Please enter your new password.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              style={styles.textInput}
            />
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={AllColors.white} />
        ) : (
          <Text style={styles.buttonText}>
            {step === 1 ? 'Next' : step === 2 ? 'Submit' : 'Update Password'}
          </Text>
        )}
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 30,
    backgroundColor: AllColors.lightBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 18,
    marginBottom: 10,
  },
  logo: {
    width: 135,
    height: 135,
    marginBottom: 15,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 15,
    marginHorizontal: 15,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderColor: AllColors.black,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: AllColors.lightBlue,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    marginHorizontal: 15,
  },
  buttonText: {
    color: AllColors.white,
    fontSize: 20,
    fontFamily: Fonts.AfacadMedium,
  },
  infoText: {
    fontSize: 18,
    color: AllColors.black,
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Fonts.AfacadRegular,
  },
});
