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
    marginTop: scale(8),
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: 0,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AllColors.white,
    borderRadius: 12,
    marginBottom: verticalScale(10),
    padding: scale(8),
    alignItems: 'center',
    borderWidth: 0,
    marginHorizontal:scale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: 10,
    marginRight: scale(10),
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.AfacadBold,
    fontSize: scale(16),
    color: AllColors.black,
    textAlign: 'left',
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
