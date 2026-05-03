import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet,View} from 'react-native';
import { moderateScale,scale,verticalScale } from '../../Constants/Scalling';
import { AllColors } from '../../Constants/COLORS';
import { Fonts } from '../../Constants/Fonts';

const CategoryList = ({ data, title, navigation, routeName, customRenderItem, onPressSeeAll }) => {

  const renderItem = customRenderItem
    ? customRenderItem
    : ({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate(routeName, {
              data: item,
              id: item._id,
            })
          }>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.url }} style={styles.itemImage} />
          </View>
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      );

  return (
    <View style={styles.CategoryMainView}>
      <View style={styles.headerRow}>
        <Text style={styles.Label}>{title}</Text>
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || item.id?.toString() || String(index)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  CategoryMainView: {
    marginTop: scale(15),
    marginBottom: scale(5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(8),
  },
  flatListContainer: {
    paddingTop: verticalScale(12),
    paddingLeft: scale(15),
    paddingRight: scale(5),
  },
  itemContainer: {
    width: scale(140),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'visible',
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: 'rgba(173, 216, 230, 0.4)',
  },
  imageWrapper: {
    width: '100%',
    height: verticalScale(100),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: moderateScale(15),
    color: AllColors.black,
    marginTop: verticalScale(10),
    textAlign: 'center',
    fontFamily: Fonts.AfacadMedium,
    paddingHorizontal: scale(8),
    lineHeight: moderateScale(18),
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: 0,
    color: AllColors.text900,
  },
  seeAll: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(14),
    color: AllColors.primary400,
  },
});

export default CategoryList;
