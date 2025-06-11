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

interface SlideItem {
  key: string;
  title: string;
  text: string;
  image: any;
  backgroundColor: string;
}

const OnBoardingScreen = (props: OnBoardingScreenProps) => {
  const SLIDER_DATA: SlideItem[] = [
    {
      key: '1',
      title: 'Welcome to My App',
      text: 'Discover new features and experiences.',
      image: Images.Logo,
      backgroundColor: '#FF7FA4',
    },
    {
      key: '2', 
      title: 'Easy to Use',
      text: 'Navigate seamlessly through the app.',
      image: Images.garbha,
      backgroundColor: '#E6BBEF',
    },
    {
      key: '3',
      title: 'Stay Connected',
      text: 'Engage with friends and family effortlessly.',
      image: Images.Dreamchild,
      backgroundColor: '#BEE4F4',
    },
  ];

  const onDone = () => {
    props.navigation.navigate('AskLoginScreen');
  };

  const renderItem = ({item}: {item: SlideItem}) => {
    return (
      <LinearGradient
        colors={['#fff', '#fff', '#A6D1E6']}
        style={styles.slide}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image}  />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <AppIntroSlider
      data={SLIDER_DATA}
      renderItem={renderItem}
      bottomButton
      onDone={onDone}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
};

export default OnBoardingScreen;
