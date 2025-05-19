import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {Fonts} from '../../Constants/Fonts';
import {moderateScale, scale} from '../../Constants/Scalling';

export default function RemediesDetails({navigation, route}) {
  const {remedyData} = route.params;

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Home Remedies"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{remedyData.title}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Diet:1</Text>
            <Text style={styles.detailValue}>{remedyData.diet}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Benefits:</Text>
            <Text style={styles.detailValue}>{remedyData.benefits}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Usage:</Text>
            <Text style={styles.detailValue}>{remedyData.usage}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Limit:</Text>
            <Text style={styles.detailValue}>{remedyData.limit}</Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {},
  titleContainer: {
    marginHorizontal: scale(15),
  },
  title: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    marginTop: scale(15),
    marginBottom: scale(15),
  },
  detailsContainer: {
    marginHorizontal: scale(15),
  },
  detailBox: {
    marginBottom: scale(15),
  },
  detailLabel: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(18),
    color: AllColors.black,
  },
  detailValue: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(16),
    color: AllColors.gray,
    marginTop: scale(3),
  },
});
