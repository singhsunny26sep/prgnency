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
    marginTop: scale(10),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  flatListContainer: {
    paddingTop: verticalScale(10),
    paddingLeft: 15,
  },
  itemContainer: {
    width: scale(150),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    // Keep overflow visible so shadows/elevation are not clipped
    overflow: 'visible',
    marginBottom: verticalScale(6),
  },
  imageWrapper: {
    width: '100%',
    height: verticalScale(120),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: moderateScale(16),
    color: AllColors.black,
    marginTop: verticalScale(8),
    textAlign: 'center',
    fontFamily: Fonts.AfacadMedium,
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: 0,
  },
  seeAll: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(14),
    color: AllColors.babyPink,
  },
});

export default CategoryList;
