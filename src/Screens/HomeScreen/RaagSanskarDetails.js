import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {moderateScale, scale} from '../../Constants/Scalling';
import {Fonts} from '../../Constants/Fonts';
import SoundPlayer from 'react-native-sound-player';

export default function RaagSanskarDetails({navigation, route}) {
  const {RaagSanskarData} = route.params;

  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const [songName, setSongName] = useState(RaagSanskarData.title); 

  const playAudio = () => {
    try {
      SoundPlayer.loadUrl(
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      );
      SoundPlayer.play();
      setIsPlaying(true);
      SoundPlayer.addEventListener('playing', data => {
        setCurrentTime(data.currentTime);
        setDuration(data.duration);
      });
    } catch (e) {
      console.log('Error playing audio', e);
    }
  };

  const pauseAudio = () => {
    try {
      SoundPlayer.pause();
      setIsPlaying(false);
    } catch (e) {
      console.log('Error pausing audio', e);
    }
  };

  const stopAudio = () => {
    try {
      SoundPlayer.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (e) {
      console.log('Error stopping audio', e);
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Raag Sanskar"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{RaagSanskarData.title}</Text>
        </View>

        <View
          style={{
            backgroundColor: AllColors.white,
            elevation: 5,
            padding: scale(15),
            borderRadius: moderateScale(8),
          }}>
          <View style={styles.songInfoContainer}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFFo6F1Jutl09Lvm9kHGKiXyREkuVeZ1zHGYtyPK5ZyH2HAbUm70znY1c&s',
              }}
              style={styles.songImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{songName}</Text>
              <Text style={styles.songDuration}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                {backgroundColor: AllColors.lightBlue},
              ]}
              onPress={isPlaying ? pauseAudio : playAudio}>
              <Text style={styles.buttonText}>
                {isPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, {backgroundColor: AllColors.red}]}
              onPress={stopAudio}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
  },
  titleContainer: {
    marginVertical: scale(15),
  },
  title: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(24),
    color: AllColors.black,
  },
  songInfoContainer: {
    flexDirection: 'row',
    marginVertical: scale(0),
    alignItems: 'center',
  },
  songImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(5),
  },
  songDetails: {
    marginLeft: scale(15),
  },
  songTitle: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(18),
    color: AllColors.black,
  },
  songDuration: {
    fontSize: moderateScale(14),
    color: AllColors.gray,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: scale(20),
  },
  controlButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(25),
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: AllColors.white,
    fontSize: moderateScale(16),
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: AllColors.black,
    borderRadius: scale(2),
    marginTop: scale(15),
  },
  progressBar: {
    height: '100%',
    backgroundColor: AllColors.babyPink,
    borderRadius: scale(2),
  },
});
