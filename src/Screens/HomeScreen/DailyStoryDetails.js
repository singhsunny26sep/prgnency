import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {moderateScale, scale} from '../../Constants/Scalling';
import {Fonts} from '../../Constants/Fonts';

export default function DailyStoryDetails({navigation, route}) {
  const {dailydetailsData} = route.params;
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Daily Story"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{dailydetailsData.title}</Text>
        </View>
        <Image source={{uri: dailydetailsData.Img}} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
          </Text>
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
    fontSize: moderateScale(21),
    marginTop: scale(15),
    marginBottom: scale(10),
  },
  image: {
    height: scale(160),
    width: scale(160),
    alignSelf: 'center',
    borderRadius: moderateScale(8),
  },
  descriptionText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(18),
    textAlign: 'justify',
  },
  textContainer: {
    marginTop: scale(15),
    marginHorizontal: scale(15),
  },
});
