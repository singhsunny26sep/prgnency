import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

type ProductPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductPage'>;

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  discount?: number;
}

const VideoSection = ({ playingVideo, setPlayingVideo }: { playingVideo: boolean; setPlayingVideo: (val: boolean) => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFB5B5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.videoTitleContainer}
      >
        <Text style={styles.videoTitleIcon}>🎬</Text>
        <Text style={styles.videoTitle}>{strings.pregnancyCareTips || '✨ Pregnancy Care Tips'}</Text>
      </LinearGradient>
      <View style={styles.videoWrapper}>
        <Video
          source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          muted={true}
          paused={!playingVideo}
        />
        <TouchableOpacity style={styles.videoOverlay} onPress={() => setPlayingVideo(!playingVideo)} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(214, 51, 108, 0.9)', 'rgba(240, 98, 146, 0.9)']}
            style={styles.playButton}
          >
            <Text style={styles.playIcon}>{playingVideo ? '⏸' : '▶'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const ProductItem = ({ item, index }: { item: Product; index: number }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<ProductPageNavigationProp>();

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const renderStars = (rating: number) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating ? styles.starFilled : styles.starEmpty]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <Animated.View
      style={[
        styles.productCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.9}
      >
        {item.discount && (
          <LinearGradient
            colors={['#FF416C', '#FF4B2B']}
            style={styles.discountBadge}
          >
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </LinearGradient>
        )}
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <LinearGradient
            colors={['#D6336C', '#F06292']}
            style={styles.addToCartGradient}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <Text style={styles.cartIcon}>🛒</Text>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProductPage = () => {
  const navigation = useNavigation<ProductPageNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState(strings.categoryAll || 'All');
  const [playingVideo, setPlayingVideo] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'all', name: strings.categoryAll || 'All', icon: '🔥' },
    { id: 'supplements', name: strings.categorySupplements || 'Supplements', icon: '💊' },
    { id: 'skincare', name: strings.categorySkincare || 'Skincare', icon: '🧴' },
    { id: 'babycare', name: strings.categoryBabyCare || 'Baby Care', icon: '🍼' },
    { id: 'books', name: strings.categoryBooks || 'Books', icon: '📚' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: strings.productPrenatalVitamins || 'Premium Prenatal Vitamins',
      price: '₹499',
      originalPrice: '₹799',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      category: strings.categorySupplements || 'Supplements',
      rating: 4.8,
      reviews: 1234,
      discount: 38,
    },
    {
      id: '2',
      name: strings.productStretchMarkCream || 'Organic Stretch Mark Cream',
      price: '₹349',
      originalPrice: '₹599',
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
      category: strings.categorySkincare || 'Skincare',
      rating: 4.6,
      reviews: 892,
      discount: 42,
    },
    {
      id: '3',
      name: strings.productBabyCarrier || 'Ergonomic Baby Carrier',
      price: '₹1,299',
      originalPrice: '₹1,999',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400',
      category: strings.categoryBabyCare || 'Baby Care',
      rating: 4.7,
      reviews: 456,
      discount: 35,
    },
    {
      id: '4',
      name: strings.productPregnancyBook || 'The Complete Pregnancy Guide',
      price: '₹599',
      originalPrice: '₹999',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      category: strings.categoryBooks || 'Books',
      rating: 4.9,
      reviews: 2345,
      discount: 40,
    },
  ];

  const filteredProducts = selectedCategory === (strings.categoryAll || 'All')
    ? products
    : products.filter(p => p.category === selectedCategory);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#D6336C', '#F06292']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{strings.productStoreTitle || '🛍️ Wellness Store'}</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartIconHeader}>🛒</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <VideoSection playingVideo={playingVideo} setPlayingVideo={setPlayingVideo} />

        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>📋 Shop by Category</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.name && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(item.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name && styles.selectedCategoryText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {selectedCategory === (strings.categoryAll || 'All') ? '✨ Featured Products' : `${selectedCategory} Products`}
          </Text>
          <Text style={styles.productCount}>{filteredProducts.length} items</Text>
        </View>

        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProductItem item={item} index={index} />}
          contentContainerStyle={styles.productsList}
          scrollEnabled={false}
        />

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    position: 'relative',
    zIndex: 10,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartIconHeader: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF416C',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  videoContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  videoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignSelf: 'flex-start',
  },
  videoTitleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  playIcon: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  viewAllText: {
    fontSize: 13,
    color: '#D6336C',
    fontWeight: '600',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFD6E0',
    elevation: 2,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategory: {
    backgroundColor: '#D6336C',
    borderColor: '#D6336C',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  productCount: {
    fontSize: 12,
    color: '#999999',
  },
  productsList: {
    paddingHorizontal: 12,
  },
  productCardWrapper: {
    flex: 1,
    margin: 4,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 6,
  },
  wishlistIcon: {
    fontSize: 16,
  },
  productCategory: {
    fontSize: 11,
    color: '#D6336C',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFB800',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  reviewsText: {
    fontSize: 11,
    color: '#999999',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D6336C',
  },
  addToCartButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  cartIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default ProductPage;