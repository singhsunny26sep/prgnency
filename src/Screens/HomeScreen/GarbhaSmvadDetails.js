import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {Fonts} from '../../Constants/Fonts';
import {moderateScale, scale} from '../../Constants/Scalling';

export default function GarbhaSmvadDetails({navigation, route}) {
  const {GarbhaData} = route.params;

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Garbha Samvad"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{GarbhaData.title}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </Text>
        </View>
        <View style={[styles.textContainer, {marginTop: scale(15)}]}>
          <Text style={styles.descriptionText}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source
          </Text>
        </View>
        <View style={[styles.textContainer, {marginTop: scale(15)}]}>
          <Text style={styles.descriptionText}>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text. All the Lorem Ipsum generators on the Internet tend
            to repeat predefined chunks as necessary, making this the first true
            generator on the Internet.
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

  descriptionText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(18),
    textAlign: 'justify',
  },
  textContainer: {
    marginHorizontal: scale(15),
  },
});
