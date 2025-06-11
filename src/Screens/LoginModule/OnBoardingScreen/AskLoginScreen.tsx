import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Images} from '../../../Assets/Images';
import metrics from '../../../Constants/Metrics';
import strings from '../../../../localization';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Fonts } from '../../../Constants/Fonts';

interface AskLoginScreenProps {
  navigation: NavigationProp<any, any>;
}

const {height, width} = Dimensions.get('window');

const AskLoginScreen = (props: AskLoginScreenProps) => {
  return (
    <Container  
     statusBarStyle={'dark-content'}
     statusBarBackgroundColor={AllColors.white}
     backgroundColor={AllColors.white}>
    <LinearGradient
      colors={['#fff', '#fff', '#A6D1E6']}
      style={styles.container}>
      <SafeAreaView />
      <Image
        source={Images.Dreamchild}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.title}>{strings.welcometoh}</Text>
      <Text style={styles.subtitle}>
        {strings.subText}
      </Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('MobileNoLogin', {isPassword: true})
          }
          style={styles.button}>
          <Text style={styles.buttonText}>Login with Mobile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('LoginScreen', {isPassword: true})
          }
          style={styles.button}>
          <Text style={styles.buttonText}>{strings.login} with Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Signup', {isPassword: true})
          }
          style={[styles.button, styles.secondaryButton]}>

          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.linkText}>
          {`Try another way? `}
          <Text style={styles.highlightedText}>
            {strings.loginwithwhatsapp}
          </Text>
        </Text>
      </View>
    </LinearGradient>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    height: height * 0.4,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontFamily:Fonts.AfacadBold,
    alignSelf: 'center',
    top: metrics.hp12,
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    top: metrics.hp13,
    lineHeight: 24,
    fontFamily:Fonts.AfacadMedium,
  },
  buttonContainer: {
    flex:1,
    justifyContent:'flex-end'
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#6FA7FF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily:Fonts.AfacadBold,
  },
  linkText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    fontFamily:Fonts.AfacadMedium,
  },
  highlightedText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
    fontFamily:Fonts.AfacadBold,
  },
});

export default AskLoginScreen;
