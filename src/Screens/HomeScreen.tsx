import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

// --- Types ---
type RootStackParamList = {
  Home: undefined;
  GarbhSanskar: undefined;
  WeeklyTips: undefined;
  Symptoms: undefined;
  BabyNames: undefined;
  Nutrition: undefined;
  Exercise: undefined;
  Products: undefined;
  Premium: undefined;
  Community: undefined;
  Appointment: undefined;
  GrowthTracking: undefined;
  ContactUs: undefined;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface FeatureItem {
  id: string;
  title: string;
  icon: string; // MaterialCommunityIcons name
  screen: keyof RootStackParamList;
  gradientColors: string[];
  subtitle?: string;
}

// --- Feature Data ---
const pregnancyFeatures: FeatureItem[] = [
  {
    id: '1',
    title: 'Garbh Sanskar',
    icon: 'meditation',
    screen: 'GarbhSanskar',
    gradientColors: ['#667eea', '#764ba2'],
    subtitle: 'Daily videos & activities',
  },
  {
    id: '2',
    title: 'Weekly Tips',
    icon: 'note-text',
    screen: 'WeeklyTips',
    gradientColors: ['#f093fb', '#f5576c'],
    subtitle: 'Week-by-week guidance',
  },
  {
    id: '3',
    title: 'Symptoms Tracker',
    icon: 'stethoscope',
    screen: 'Symptoms',
    gradientColors: ['#4facfe', '#00f2fe'],
    subtitle: 'Track your health',
  },
  {
    id: '4',
    title: 'Baby Names',
    icon: 'baby',
    screen: 'BabyNames',
    gradientColors: ['#43e97b', '#38f9d7'],
    subtitle: 'Find the perfect name',
  },
  {
    id: '5',
    title: 'Nutrition Guide',
    icon: 'food-apple',
    screen: 'Nutrition',
    gradientColors: ['#fa709a', '#fee140'],
    subtitle: 'Healthy eating tips',
  },
  {
    id: '6',
    title: 'Exercise',
    icon: 'run',
    screen: 'Exercise',
    gradientColors: ['#a8edea', '#fed6e3'],
    subtitle: 'Safe workouts',
  },
  {
    id: '7',
    title: 'Products',
    icon: 'shopping',
    screen: 'Products',
    gradientColors: ['#ff9a9e', '#fecfef'],
    subtitle: 'Essential products',
  },
  {
    id: '8',
    title: 'Premium',
    icon: 'crown',
    screen: 'Premium',
    gradientColors: ['#f6d365', '#fda085'],
    subtitle: 'Unlock all features',
  },
  {
    id: '9',
    title: 'Community',
    icon: 'account-group',
    screen: 'Community',
    gradientColors: ['#89f7fe', '#66a6ff'],
    subtitle: 'Connect with moms',
  },
  {
    id: '10',
    title: 'Appointment',
    icon: 'calendar',
    screen: 'Appointment',
    gradientColors: ['#a18cd1', '#fbc2eb'],
    subtitle: 'Consult experts',
  },
  {
    id: '11',
    title: 'Growth',
    icon: 'chart-line',
    screen: 'GrowthTracking',
    gradientColors: ['#ffecd2', '#fcb69f'],
    subtitle: 'Track development',
  },
];

// --- Sub-components (memoized) ---

interface FeatureCardProps {
  item: FeatureItem;
  index: number;
  onPress: () => void;
}

const FeatureCard = React.memo(({ item, index, onPress }: FeatureCardProps) => {
  const scaleAnim = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scaleAnim.value = withSpring(0.94);
    })
    .onFinalize(() => {
      scaleAnim.value = withSpring(1);
    })
    .onEnd(() => {
      onPress();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.featureCard,
          animatedStyle,
          index === 0 && styles.featureCardFeatured,
        ]}
      >
        <LinearGradient
          colors={item.gradientColors}
          style={styles.featureIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name={item.icon} size={moderateScale(30)} color="#fff" />
        </LinearGradient>
        <Text style={styles.featureTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.featureSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        {index === 0 && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Popular</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

interface QuickActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  colors: string[];
}

const QuickAction = React.memo(({ icon, label, onPress, colors }: QuickActionProps) => {
  const scaleAnim = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onBegin(() => { scaleAnim.value = withSpring(0.92); })
    .onFinalize(() => { scaleAnim.value = withSpring(1); })
    .onEnd(() => { onPress(); });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.quickActionCard, animatedStyle]}>
        <LinearGradient
          colors={colors}
          style={styles.quickActionIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name={icon} size={moderateScale(28)} color="#fff" />
        </LinearGradient>
        <Text style={styles.quickActionText}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
});

// --- Main HomeScreen ---

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width, height } = useWindowDimensions();

  // Responsive breakpoints
  const isSmallDevice = width < 375;
  const isTablet = width >= 768;

  // Current date & greeting
  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? 'Good Morning'
      : currentDate.getHours() < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Memoize feature list to avoid re-renders
  const featureData = useMemo(() => pregnancyFeatures, []);

  // Handlers
  const handleFeaturePress = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const handleQuickAction = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  // Render feature card
  const renderFeature = ({ item, index }: { item: FeatureItem; index: number }) => (
    <FeatureCard
      item={item}
      index={index}
      onPress={() => handleFeaturePress(item.screen)}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="#D6336C" />

      {/* --- Header --- */}
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>{greeting}! 👋</Text>
              <Text style={styles.headerTitle}>Welcome to HiranyaGarbha</Text>
            </View>
            <View style={styles.headerRight}>
              {/* User Avatar */}
              <TouchableOpacity style={styles.avatarWrapper}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>HG</Text>
                </LinearGradient>
              </TouchableOpacity>
              {/* Notification Bell */}
              <TouchableOpacity style={styles.notificationButton}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                  style={styles.notificationGradient}
                >
                  <Icon name="bell-outline" size={moderateScale(22)} color="#fff" />
                </LinearGradient>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          <Text style={styles.subtitleText}>
            India's Most Trusted Garbhsanskar Community
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Icon name="magnify" size={moderateScale(22)} color="#999" />
          <Text style={styles.searchPlaceholder}>
            Search features, tips, doctors...
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* --- Stats Cards --- */}
      <View style={styles.statsSection}>
        <View style={styles.statsCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.statIconWrapper}
          >
            <Icon name="calendar-week" size={moderateScale(24)} color="#fff" />
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>24th</Text>
            <Text style={styles.statLabel}>Current Week</Text>
          </View>
          <View style={styles.statTrend}>
            <Text style={styles.trendIcon}>📈</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <LinearGradient
            colors={['#4ECDC4', '#6EE7DE']}
            style={styles.statIconWrapper}
          >
            <Icon name="weight" size={moderateScale(24)} color="#fff" />
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>600g</Text>
            <Text style={styles.statLabel}>Baby Weight</Text>
          </View>
          <View style={styles.statTrend}>
            <Text style={styles.trendIcon}>📈</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <LinearGradient
            colors={['#A78BFA', '#C4B5FD']}
            style={styles.statIconWrapper}
          >
            <Icon name="target" size={moderateScale(24)} color="#fff" />
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>Oct 15</Text>
            <Text style={styles.statLabel}>Due Date</Text>
          </View>
          <View style={styles.statTrend}>
            <Text style={styles.trendIcon}>⏳</Text>
          </View>
        </View>
      </View>

      {/* --- Quick Actions --- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          <QuickAction
            icon="calendar-check"
            label="Book Appointment"
            onPress={() => handleQuickAction('Appointment')}
            colors={['#FF6B6B', '#FF8E8E']}
          />
          <QuickAction
            icon="shopping"
            label="Shop Now"
            onPress={() => handleQuickAction('Products')}
            colors={['#4ECDC4', '#6EE7DE']}
          />
          <QuickAction
            icon="crown"
            label="Go Premium"
            onPress={() => handleQuickAction('Premium')}
            colors={['#F59E0B', '#FBBF24']}
          />
          <QuickAction
            icon="chat"
            label="Contact Us"
            onPress={() => handleQuickAction('ContactUs')}
            colors={['#A78BFA', '#C4B5FD']}
          />
        </ScrollView>
      </View>

      {/* --- Features Grid --- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✨ Features</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featureData}
          keyExtractor={(item) => item.id}
          numColumns={isTablet ? 3 : 2}
          renderItem={renderFeature}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false} // since inside ScrollView
          key={isTablet ? 'tablet' : 'phone'} // force re-render on numColumns change
        />
      </View>

      {/* --- Premium Banner --- */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumBanner}
      >
        <View style={styles.premiumContent}>
          <View style={styles.premiumHeader}>
            <LinearGradient
              colors={['#F59E0B', '#FBBF24']}
              style={styles.premiumIconWrapper}
            >
              <Icon name="crown" size={moderateScale(28)} color="#1a1a2e" />
            </LinearGradient>
            <View style={styles.premiumBadgeRow}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
              <View style={styles.premiumBadgeSecondary}>
                <Text style={styles.premiumBadgeSecondaryText}>Save 40%</Text>
              </View>
            </View>
          </View>

          <Text style={styles.premiumTitle}>Unlock Complete Garbh Sanskar</Text>
          <Text style={styles.premiumText}>
            Get Hiranyagarbha Book and Daily 25+ Activities for Unborn Child's PQ,
            IQ, EQ, & SQ Development
          </Text>

          <View style={styles.premiumFeatures}>
            <View style={styles.premiumFeatureItem}>
              <Text style={styles.premiumFeatureIcon}>✓</Text>
              <Text style={styles.premiumFeatureText}>100+ Exclusive Videos</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <Text style={styles.premiumFeatureIcon}>✓</Text>
              <Text style={styles.premiumFeatureText}>Expert Sessions</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <Text style={styles.premiumFeatureIcon}>✓</Text>
              <Text style={styles.premiumFeatureText}>Personalized Guidance</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.premiumButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#F59E0B', '#FBBF24']}
              style={styles.premiumButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.premiumButtonText}>Get Premium Now →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* --- Daily Tip --- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💡 Daily Tip</Text>
        </View>
        <LinearGradient
          colors={['#fff5f7', '#ffe4e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipCard}
        >
          <View style={styles.tipHeader}>
            <LinearGradient
              colors={['#D6336C', '#F06292']}
              style={styles.tipIconWrapper}
            >
              <Icon name="lightbulb-on" size={moderateScale(22)} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipSubtitle}>Tip of the day</Text>
            </View>
          </View>
          <Text style={styles.tipText}>
            Drink at least 8-10 glasses of water daily. Proper hydration helps
            maintain amniotic fluid levels and supports fetal development.
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

// --- Styles (fully responsive) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: verticalScale(24),
  },
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    elevation: 8,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerContent: {
    marginBottom: verticalScale(16),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  greetingText: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.9)',
    marginBottom: verticalScale(4),
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  avatarWrapper: {
    marginRight: scale(6),
  },
  avatarGradient: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationGradient: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
    borderWidth: 2,
    borderColor: '#D6336C',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.85)',
    marginBottom: verticalScale(4),
    fontWeight: '500',
  },
  subtitleText: {
    fontSize: moderateScale(13),
    color: 'rgba(255,255,255,0.9)',
    lineHeight: verticalScale(20),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(8),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchPlaceholder: {
    fontSize: moderateScale(14),
    color: '#999',
    marginLeft: scale(10),
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    marginTop: -verticalScale(20),
    gap: scale(12),
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: moderateScale(14),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE4E9',
  },
  statIconWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statInfo: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: moderateScale(10),
    color: '#666',
    textAlign: 'center',
    lineHeight: verticalScale(14),
  },
  statTrend: {
    marginTop: verticalScale(6),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    backgroundColor: '#FFF5F7',
    borderRadius: moderateScale(12),
  },
  trendIcon: {
    fontSize: moderateScale(12),
  },
  section: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(28),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: moderateScale(14),
    color: '#D6336C',
    fontWeight: '600',
  },
  quickActionsContainer: {
    gap: scale(12),
    paddingRight: scale(4),
  },
  quickActionCard: {
    alignItems: 'center',
    minWidth: scale(80),
  },
  quickActionIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(6),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  quickActionText: {
    fontSize: moderateScale(11),
    color: '#444',
    fontWeight: '600',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  featureCard: {
    width: '48%', // will be controlled by FlatList column wrapper
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: moderateScale(14),
    alignItems: 'center',
    marginBottom: verticalScale(10),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  featureCardFeatured: {
    borderWidth: 2,
    borderColor: '#D6336C',
    backgroundColor: '#FFF5F7',
  },
  featureIconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: verticalScale(2),
  },
  featureSubtitle: {
    fontSize: moderateScale(10),
    color: '#888',
    textAlign: 'center',
    lineHeight: verticalScale(14),
  },
  featuredBadge: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    backgroundColor: '#D6336C',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
  },
  featuredBadgeText: {
    fontSize: moderateScale(9),
    color: '#FFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  premiumBanner: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0f3460',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  premiumContent: {
    padding: moderateScale(24),
    alignItems: 'center',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    width: '100%',
    justifyContent: 'space-between',
  },
  premiumIconWrapper: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  premiumBadgeRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
  },
  premiumBadgeText: {
    fontSize: moderateScale(10),
    color: '#FFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  premiumBadgeSecondary: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  premiumBadgeSecondaryText: {
    fontSize: moderateScale(10),
    color: '#FFF',
    fontWeight: '700',
  },
  premiumTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: verticalScale(10),
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  premiumText: {
    fontSize: moderateScale(13),
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(22),
    paddingHorizontal: scale(8),
  },
  premiumFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  premiumFeatureIcon: {
    color: '#FBBF24',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginRight: scale(6),
  },
  premiumFeatureText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  premiumButton: {
    borderRadius: moderateScale(30),
    overflow: 'hidden',
    width: '100%',
    elevation: 4,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  premiumButtonGradient: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: moderateScale(16),
    color: '#1a1a2e',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tipCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    elevation: 3,
    shadowColor: '#D6336C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE4E9',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  tipIconWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  tipTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: verticalScale(2),
  },
  tipSubtitle: {
    fontSize: moderateScale(12),
    color: '#888',
  },
  tipText: {
    fontSize: moderateScale(14),
    color: '#555',
    lineHeight: verticalScale(22),
  },
  bottomSpacing: {
    height: verticalScale(24),
  },
});

export default HomeScreen;