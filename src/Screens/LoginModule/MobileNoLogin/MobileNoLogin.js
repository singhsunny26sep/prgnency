import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import {Fonts} from '../../../Constants/Fonts';
import {moderateScale, scale, verticalScale} from '../../../Constants/Scalling';
import {Instance} from '../../../API/Instance';

export default function MobileNoLogin({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileLogin = async () => {
    if (mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const response = await Instance.post('/api/users/mobile-otp-request', {
        mobile: mobileNumber,
      });

      const data = response.data;

      if (data.success) {
        navigation.navigate('MobileNoVerify', {
          details: data.result.Details,
          mobile: mobileNumber,
        });
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error response data:', error.response.data);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Mobile Login"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-vector/enter-your-number-2-step-verification-illustration-concept_108061-1256.jpg',
            }}
            style={styles.IMG}
          />
        </View>

        <Text style={styles.instructionText}>
          Please enter your 10-digit mobile number to continue. We will send you
          an OTP for verification.
        </Text>

        <View style={styles.phoneInputContainer}>
          <View style={styles.flagContainer}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmHqUFx4yBWukSFU98PfOvQaSbIoVjgSz6tA&s',
              }}
              style={styles.FlagIMG}
            />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              value={mobileNumber}
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={text => setMobileNumber(text)}
              placeholder="Mobile Number"
              style={styles.textInputStyle}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleMobileLogin}>
          {loading ? (
            <ActivityIndicator size="small" color={AllColors.white} />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  phoneInputContainer: {
    alignItems: 'center',
    marginTop: moderateScale(30),
    paddingHorizontal: scale(15),
  },
  IMG: {
    height: scale(200),
    width: scale(200),
    alignSelf: 'center',
    marginTop: scale(30),
  },
  FlagIMG: {
    height: scale(25),
    width: scale(35),
    borderRadius: moderateScale(5),
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: moderateScale(58),
    borderRadius: moderateScale(10),
    backgroundColor: '#ECECEC',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(10),
  },
  countryCode: {
    marginLeft: scale(10),
    fontSize: moderateScale(18),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  textInputStyle: {
    backgroundColor: 'transparent',
    paddingVertical: moderateScale(4),
    flex: 1,
    marginLeft: scale(10),
    fontSize: moderateScale(18),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    marginTop: moderateScale(50),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginHorizontal: scale(15),
  },
  loginButtonText: {
    color: AllColors.white,
    fontSize: moderateScale(18),
    fontFamily: Fonts.AfacadBold,
  },
  instructionText: {
    textAlign: 'center',
    marginTop: moderateScale(20),
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.black,
    paddingHorizontal: scale(20),
  },
  noteText: {
    textAlign: 'center',
    marginTop: moderateScale(20),
    fontSize: moderateScale(14),
    fontFamily: Fonts.Afacad,
    color: AllColors.darkGrey,
    paddingHorizontal: scale(20),
  },
});
