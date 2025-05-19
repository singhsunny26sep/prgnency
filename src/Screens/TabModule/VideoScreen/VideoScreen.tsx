import {NavigationProp} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Images} from '../../../Assets/Images';
import {styles} from './style';
import {YoutubePlayer} from 'react-native-video-extension';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import Video from 'react-native-video';

interface VideoScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const VideoScreen = (props: VideoScreenProps) => {
  const videoRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          <CustomHeader
            type="back"
            screenName="Video Player"
            onPressBack={() => {
              props.navigation.goBack();
            }}
          />
          <View>
            <Video
              ref={videoRef}
              source={{
                uri: 'https://stream.mux.com/Tyu80069gbkJR2uIYlz2xARq8VOl4dLg3.m3u8',
              }}
              
              fullscreenAutorotate
              
              style={isFullScreen ? styles.videoFullScreen : styles.video}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VideoScreen;
