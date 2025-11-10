import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { verticalScale,scale,moderateScale } from '../../Constants/Scalling';
import {AllColors} from '../../Constants/COLORS';
import {Fonts} from '../../Constants/Fonts';

const SecondCategory = ({navigation, routeName, data, title, onPressItem, onPressSeeAll}) => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressItem ? onPressItem(item) : navigation.navigate(routeName, {data: item})}>
      <Image source={{uri: item.url}} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );  

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.Label}>{title}</Text>
       
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || String(index)}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    marginTop: scale(15),
    marginBottom: verticalScale(8),
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: 0,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AllColors.white,
    borderRadius: 16,
    marginBottom: verticalScale(12),
    padding: scale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(173, 216, 230, 0.3)',
    marginHorizontal:scale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: scale(85),
    height: verticalScale(85),
    borderRadius: 12,
    marginRight: scale(12),
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(16),
    color: AllColors.black,
    textAlign: 'left',
    lineHeight: moderateScale(20),
  },
  flatListContainer: {
    paddingTop: verticalScale(10),
  },
  seeAll: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(14),
    color: AllColors.babyPink,
  },
});

export default SecondCategory;
