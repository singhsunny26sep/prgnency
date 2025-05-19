import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {moderateScale, scale} from '../../Constants/Scalling';
import {Fonts} from '../../Constants/Fonts';
import { Instance } from '../../API/Instance';

export default function MantrasandChantsDetails({navigation, route}) {
  const {MantraData,id} = route.params;

  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await Instance.get(`/api/image/category/${id}`);
        if (response.data.success) {
          setImageData(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [id]);

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Mantras and chants"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
      <View>
          <Text style={styles.monthText}>{imageData?.title}</Text>
          {loading ? (
            <ActivityIndicator size="large" color={AllColors.primary} />
          ) : (
            imageData && (
              <Image source={{uri: imageData.url}} style={styles.image} />
            )
          )}
        </View>
        <View style={styles.textContainer}>
        <Text style={styles.descriptionText}>{imageData?.description}</Text>
        </View>
      </ScrollView>
    </Container>
  );
}
const styles = StyleSheet.create({
  monthText: {
    textAlign: 'center',
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    marginTop: scale(15),
  },
  image: {
    height: scale(160),
    width: scale(160),
    alignSelf: 'center',
    borderRadius: moderateScale(5),
    marginTop: scale(20),
  },
  textContainer: {
    marginTop: scale(15),
    marginHorizontal: scale(15),
  },
  descriptionText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(18),
    textAlign: 'justify',
  },
});
