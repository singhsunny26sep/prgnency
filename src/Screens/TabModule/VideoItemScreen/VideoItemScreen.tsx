import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './style';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import VideoItem from '../../../Components/CustomViewForVideo/VideoItem';
import {Images} from '../../../Assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';

interface VideoItemScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const VideoItemScreen = (props: VideoItemScreenProps) => {
  const menuItems = [
    {
      title: 'Video Item 1',
      subtitle: 'Subtitle text',
      iconName: Images.DummyImage,
      onPress: () => props.navigation.navigate('VideoScreen'),
    },
    {
      title: 'Video Item 2', 
      subtitle: 'Subtitle text',
      iconName: Images.DummyImage,
      onPress: () => console.log('My rewards'),
    },
    {
      title: 'Video Item 3',
      subtitle: 'Subtitle text',
      iconName: Images.DummyImage,
      onPress: () => props.navigation.navigate('VideoScreen'),
    },
  ];

  return (
    <Container 
     statusBarStyle={'dark-content'}
     statusBarBackgroundColor={AllColors.lightBlue}
     backgroundColor={AllColors.white}>
      <View style={styles.headerView}>
        <CustomHeader
          type="back"
          screenName="Video Player List"
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>

      <View >
        {menuItems.map(item => {
          return (
            <VideoItem
              title={item.title}
              iconName={item.iconName}
              subtitle={item.subtitle}
              onPress={item.onPress}
            />
          );
        })}
      </View>
    </Container>
  );
};

export default VideoItemScreen;
