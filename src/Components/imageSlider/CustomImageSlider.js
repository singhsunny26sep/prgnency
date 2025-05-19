import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { AllColors } from '../../Constants/COLORS';
import { moderateScale, scale, verticalScale } from '../../Constants/Scalling';

const { width } = Dimensions.get('window');

const CustomImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ index: nextIndex });
        return nextIndex;
      });
    }, 3000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image resizeMode="cover" source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.pagination}>
        {images.map((_, i) => (
          <View
            key={i.toString()}
            style={[styles.dot, currentIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(170),
    marginTop: scale(8),
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: verticalScale(170),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '100%',
    resizeMode: 'cover',
    borderTopRightRadius: moderateScale(5),
    borderTopLeftRadius: moderateScale(5),
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: verticalScale(10),
    alignSelf: 'center',
  },
  dot: {
    height: scale(12),
    width: scale(12),
    borderRadius: scale(20),
    backgroundColor: AllColors.lightBlue,
    marginHorizontal: scale(5),
  },
  activeDot: {
    backgroundColor: AllColors.white,
  },
});

export default CustomImageSlider;
