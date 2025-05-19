import React, {useRef} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {Fonts} from '../../Constants/Fonts';
import {scale, verticalScale, moderateScale} from '../../Constants/Scalling';
import Video from 'react-native-video';

export default function YogaDetails({navigation, route}) {
  const {YogaData} = route.params;

  const videoRef = useRef(null);

  const benefits = [
    YogaData.benefits1,
    YogaData.benefits2,
    YogaData.benefits3,
  ];

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Monthly Yoga"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{YogaData.type}</Text>
        </View>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{
              uri: YogaData.video,
            }}
            fullscreenAutorotate
            style={styles.video}
            resizeMode="contain"
            controls={true}
          />
        </View>
        <Text style={styles.prepareText}>
          To prepare body for Asanas = repeat 5 times
        </Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Yoga Benefits</Text>
        </View>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <Text key={index} style={styles.benefitText}>
              {index + 1}. {benefit}
            </Text>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginHorizontal: scale(15),
  },
  title: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(25),
    marginTop: scale(15),
    marginBottom: scale(15),
  },
  videoContainer: {
    marginHorizontal: scale(15),
  },
  video: {
    width: '100%',
    height: verticalScale(170),
    borderRadius: moderateScale(10),
  },
  prepareText: {
    marginHorizontal: scale(15),
    marginVertical: verticalScale(15),
    fontFamily: Fonts.AfacadMedium,
    fontSize: moderateScale(19),
  },
  benefitsContainer: {
    marginHorizontal: scale(15),
    marginBottom: verticalScale(15),
  },
  benefitText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(20),
    marginVertical: verticalScale(5),
  },
});
