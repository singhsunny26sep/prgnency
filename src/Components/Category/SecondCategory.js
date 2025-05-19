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

const SecondCategory = ({navigation, routeName, data, title, onPressItem}) => {
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
      <Text style={styles.Label}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: scale(15),
    marginTop:scale(8)
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AllColors.white,
    borderRadius: 10,
    marginBottom: verticalScale(10),
    padding: scale(5),
    alignItems: 'center',
    borderWidth: 0.3,
    marginHorizontal:scale(15)
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
});

export default SecondCategory;
