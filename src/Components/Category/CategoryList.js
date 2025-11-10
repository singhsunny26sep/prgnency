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
    width: scale(150),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    // Keep overflow visible so shadows/elevation are not clipped
    overflow: 'visible',
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: 'rgba(173, 216, 230, 0.3)',
  },
  imageWrapper: {
    width: '100%',
    height: verticalScale(120),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: moderateScale(16),
    color: AllColors.black,
    marginTop: verticalScale(10),
    textAlign: 'center',
    fontFamily: Fonts.AfacadMedium,
    paddingHorizontal: scale(8),
    lineHeight: moderateScale(20),
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
