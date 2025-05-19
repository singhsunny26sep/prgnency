import React from 'react';
import { FlatList, Text, TouchableOpacity, Image, StyleSheet,View} from 'react-native';
import { moderateScale,scale,verticalScale } from '../../Constants/Scalling';
import { AllColors } from '../../Constants/COLORS';
import { Fonts } from '../../Constants/Fonts';

const CategoryList = ({ data, title, navigation, routeName, customRenderItem }) => {

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
          <Image source={{ uri: item.url }} style={styles.itemImage} />
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      );

  return (
    <View style={styles.CategoryMainView}>
      <Text style={styles.Label}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id || item.id?.toString()}
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
  flatListContainer: {
    paddingTop: verticalScale(10),
    paddingLeft: 15,
  },
  itemContainer: {
    width: scale(150),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(5),
  },
  itemImage: {
    width: '100%',
    height: verticalScale(120),
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemText: {
    fontSize: moderateScale(16),
    color: AllColors.black,
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: scale(15),
  },
});

export default CategoryList;
