import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  RefreshControl,
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

interface VideoItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  video: string;
  subCategory: {
    name: string;
    _id: string;
  };
  category: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

const GarbhSanskarPage = () => {
  const navigation = useNavigation<ProductPageNavigationProp>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      const response = await fetch('https://hiranyagarbha.onrender.com/hiranyagarbha/banners/getAll?limit=100');
      const data = await response.json();
      console.log(data,"this is data")
      if (data.success && data.data.data) {
        setVideos(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

const getCategoryIcon = (category: string) => {
     const icons: { [key: string]: string } = {
       mantra: '🔱',
       stuti: '🙏',
       guidence: '📚',
       general: '🎥',
     };
     return icons[category.toLowerCase()] || '📹';
   };

   // Extract unique subCategories from videos
   const categories = [
     { id: 'all', name: 'All Videos', icon: '🎬' },
     ...Array.from(new Map(videos.map(v => [v.subCategory?.name, v.subCategory])).entries())
       .filter(([name]) => name)
       .map(([name, subCat]) => ({
         id: subCat?._id || name,
         name: name?.charAt(0).toUpperCase() + name?.slice(1),
         icon: getCategoryIcon(name || ''),
       })),
   ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.subCategory?._id === selectedCategory);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

const VideoCard = ({ item, index }: { item: VideoItem; index: number }) => {
     const scaleAnim = useRef(new Animated.Value(0)).current;
     const [videoError, setVideoError] = useState(false);
     const isCurrentlyPlaying = playingVideoId === item._id;

     useEffect(() => {
       Animated.spring(scaleAnim, {
         toValue: 1,
         delay: index * 100,
         useNativeDriver: true,
         tension: 50,
         friction: 7,
       }).start();
     }, []);

     const handlePlayPress = () => {
       if (isCurrentlyPlaying) {
         setPlayingVideoId(null);
       } else {
         setPlayingVideoId(item._id);
       }
     };

     return (
       <Animated.View
         style={[
           styles.videoCard,
           {
             transform: [{ scale: scaleAnim }],
             opacity: scaleAnim,
           },
         ]}
       >
         <TouchableOpacity activeOpacity={0.9} onPress={handlePlayPress}>
           <View style={styles.videoThumbnail}>
             <Video
               source={{ uri: item.video }}
               style={styles.videoPlayer}
               resizeMode="cover"
               paused={!isCurrentlyPlaying}
               repeat={true}
               muted={false}
               ignoreSilentSwitch="ignore-silent"
               onError={(error: any) => {
                 console.log('Video error for', item._id, ':', JSON.stringify(error));
                 setVideoError(true);
               }}
               onEnd={() => {
                 setPlayingVideoId(null);
               }}
             />

             {/* Overlay when paused */}
             {!isCurrentlyPlaying && (
               <Image source={{ uri: item.image }} style={[StyleSheet.absoluteFillObject, styles.thumbnailImage]} />
             )}

             {/* Error overlay */}
             {videoError && (
               <View style={[StyleSheet.absoluteFillObject, styles.videoErrorOverlay]}>
                 <Text style={styles.videoErrorText}>⚠️ Video failed to load</Text>
               </View>
             )}

             {/* Gradient + Play button when paused */}
             {!isCurrentlyPlaying && (
               <>
                 <LinearGradient
                   colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                   style={styles.videoGradient}
                 />
                 <TouchableOpacity style={styles.playOverlay} onPress={handlePlayPress}>
                   <LinearGradient
                     colors={['#D6336C', '#F06292']}
                     style={styles.playButton}
                   >
                     <Text style={styles.playIcon}>▶</Text>
                   </LinearGradient>
                 </TouchableOpacity>
               </>
             )}

             <View style={styles.durationBadge}>
               <Text style={styles.durationText}>
                 {formatDate(item.createdAt)}
               </Text>
             </View>
           </View>
         </TouchableOpacity>

         <View style={styles.videoInfo}>
           <View style={styles.videoDetails}>
             <Text style={styles.videoTitle} numberOfLines={2}>
               {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
             </Text>
             <Text style={styles.videoDescription} numberOfLines={2}>
               {item.description}
             </Text>
             <View style={styles.metaInfo}>
               <Text style={styles.metaText}>
                 {item.subCategory?.name ? `✨ ${item.subCategory.name.charAt(0).toUpperCase() + item.subCategory.name.slice(1)}` : '✨ General'}
               </Text>
             </View>
           </View>
           <TouchableOpacity style={styles.saveButton}>
             <Text style={styles.saveIcon}>🔖</Text>
           </TouchableOpacity>
         </View>
       </Animated.View>
     );
   };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D6336C" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#D6336C', '#F06292', '#F8B4C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerIcon}>🌸</Text>
            <Text style={styles.headerTitle}>{strings.garbhSanskarVideos || 'Garbh Sanskar Videos'}</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D6336C']} />
        }
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={['#FFE4E9', '#FFF0F3']}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>🎯</Text>
            <Text style={styles.heroTitle}>
              {strings.dailyActivities || 'Daily Activities for Your Baby'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {strings.watchDailyForBaby || 'Watch these videos daily for your baby\'s PQ, IQ, EQ & SQ development'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{videos.length}+</Text>
                <Text style={styles.statLabel}>Videos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{categories.length - 1}</Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Categories */}
        {categories.length > 1 && (
          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.id && styles.selectedCategoryText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedCategory === item.id && (
                    <View style={styles.categoryIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Videos Header */}
        <View style={styles.videosHeader}>
          <Text style={styles.videosTitle}>
            {selectedCategory === 'all' ? '📺 All Videos' : `${categories.find(c => c.id === selectedCategory)?.name} Videos`}
          </Text>
          <Text style={styles.videoCount}>{filteredVideos.length} videos</Text>
        </View>

        {/* Videos List */}
        {filteredVideos.length > 0 ? (
          <FlatList
            data={filteredVideos}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => <VideoCard item={item} index={index} />}
            contentContainerStyle={styles.videoList}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎬</Text>
            <Text style={styles.emptyText}>No videos in this category</Text>
          </View>
        )}

        {/* Premium CTA */}
        <LinearGradient
          colors={['#D6336C', '#F06292']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumCTA}
        >
          <Text style={styles.premiumIcon}>🌟</Text>
          <Text style={styles.premiumCTATitle}>Unlock All Videos</Text>
          <Text style={styles.premiumCTAText}>
            Get access to 100+ exclusive Garbh Sanskar videos, expert sessions, and personalized guidance
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium →</Text>
          </TouchableOpacity>
        </LinearGradient>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#D6336C',
    fontWeight: '500',
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    fontSize: 20,
  },
  heroBanner: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#D6336C',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D6336C',
  },
  statLabel: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#FFD6E0',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 8,
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
    position: 'relative',
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
  categoryIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6336C',
  },
  videosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  videosTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  videoCount: {
    fontSize: 12,
    color: '#999999',
  },
  videoList: {
    paddingHorizontal: 16,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  videoThumbnail: {
    height: isTablet ? 250 : 200,
    backgroundColor: '#000',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  playIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  videoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  videoDetails: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  videoDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#D6336C',
    fontWeight: '500',
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#FFF5F7',
    borderRadius: 25,
  },
  saveIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  premiumCTA: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  premiumIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  premiumCTATitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  premiumCTAText: {
    fontSize: 12,
    color: '#FFF5F7',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    opacity: 0.95,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D6336C',
  },
videoErrorOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoErrorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default GarbhSanskarPage;