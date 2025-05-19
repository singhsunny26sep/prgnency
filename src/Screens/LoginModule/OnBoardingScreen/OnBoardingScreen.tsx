import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {Images} from '../../../Assets/Images';
import metrics from '../../../Constants/Metrics';
import AppIntroSlider from 'react-native-app-intro-slider';
import {fontSize} from '../../../Constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';

interface OnBoardingScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const OnBoardingScreen = (props: OnBoardingScreenProps) => {
  const SLIDER_DATA = [
    {
      key: '1',
      title: 'Welcome to My App',
      text: 'Discover new features and experiences.',
      image: Images.educationalresource, // Replace with your image
      backgroundColor: '#FF7FA4',
    },
    {
      key: '2', 
      title: 'Easy to Use',
      text: 'Navigate seamlessly through the app.',
      image: Images.tracktools, // Replace with your image
      backgroundColor: '#E6BBEF',
    },
    {
      key: '3',
      title: 'Stay Connected',
      text: 'Engage with friends and family effortlessly.',
      image: Images.safebump, // Replace with your image
      backgroundColor: '#BEE4F4',
    },
  ];

  const onDone = () => {
    props.navigation.navigate('AskLoginScreen');
  };

  return (
    <AppIntroSlider
      data={SLIDER_DATA}
      renderItem={({item}) => (
         <LinearGradient
                  colors={['#fff', '#fff', '#A6D1E6']} style={[styles.slide]}>
          <Image source={item.image} style={styles.image} />
        </LinearGradient>
      )}
      bottomButton
      onDone={onDone}
    />
  );
};

export default OnBoardingScreen;
