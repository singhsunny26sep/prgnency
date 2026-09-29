import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
  Animated as RNAnimated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { useAuth } from '../Context/AuthContext';
import { fetchUnreadCount } from '../services/NotificationService';

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
  Notification: undefined;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface FeatureItem {
  id: string;
  title: string;
  icon: string;
  screen: keyof RootStackParamList;
  gradient: string[];
  subtitle: string;
}

// --- MODERN AURORA COLOR SYSTEM ---
const THEME = {
  // Backgrounds
  bg: '#0A0A0F',              // Deep space black
  bgElevated: '#14141C',      // Elevated surface
  bgGlass: 'rgba(255,255,255,0.04)',
  bgGlassStrong: 'rgba(255,255,255,0.08)',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textTertiary: 'rgba(255,255,255,0.4)',

  // Accents
  rose: '#FF4D8D',
  roseGlow: 'rgba(255,77,141,0.35)',
  violet: '#A78BFA',
  violetGlow: 'rgba(167,139,250,0.35)',
  cyan: '#22D3EE',
  cyanGlow: 'rgba(34,211,238,0.35)',
  amber: '#FBBF24',
  amberGlow: 'rgba(251,191,36,0.35)',
  mint: '#34D399',
  mintGlow: 'rgba(52,211,153,0.35)',
};

// --- Feature Data with Aurora Gradients ---
const pregnancyFeatures: FeatureItem[] = [
  { id: '1', title: 'Garbh Sanskar', icon: 'meditation', screen: 'GarbhSanskar', gradient: ['#A78BFA', '#7C3AED'], subtitle: 'Daily rituals' },
  { id: '2', title: 'Weekly Tips', icon: 'note-text-outline', screen: 'WeeklyTips', gradient: ['#FF4D8D', '#D6336C'], subtitle: 'Week guide' },
  { id: '3', title: 'Symptoms', icon: 'stethoscope', screen: 'Symptoms', gradient: ['#22D3EE', '#0891B2'], subtitle: 'Track health' },
  { id: '4', title: 'Baby Names', icon: 'baby-face-outline', screen: 'BabyNames', gradient: ['#FBBF24', '#F59E0B'], subtitle: 'Find names' },
  { id: '5', title: 'Nutrition', icon: 'food-apple-outline', screen: 'Nutrition', gradient: ['#34D399', '#059669'], subtitle: 'Diet plans' },
  { id: '6', title: 'Exercise', icon: 'yoga', screen: 'Exercise', gradient: ['#818CF8', '#4F46E5'], subtitle: 'Safe yoga' },
  { id: '7', title: 'Products', icon: 'shopping-outline', screen: 'Products', gradient: ['#FB7185', '#E11D48'], subtitle: 'Essentials' },
  { id: '8', title: 'Premium', icon: 'crown-outline', screen: 'Premium', gradient: ['#FCD34D', '#F59E0B'], subtitle: 'Unlock all' },
  { id: '9', title: 'Community', icon: 'account-group-outline', screen: 'Community', gradient: ['#60A5FA', '#2563EB'], subtitle: 'Connect' },
  { id: '10', title: 'Appointment', icon: 'calendar-check-outline', screen: 'Appointment', gradient: ['#4ADE80', '#16A34A'], subtitle: 'Book doctor' },
  { id: '11', title: 'Growth', icon: 'chart-timeline-variant', screen: 'GrowthTracking', gradient: ['#F472B6', '#DB2777'], subtitle: 'Baby progress' },
];

// --- Sub-components ---

// Glowing Feature Card
interface FeatureCardProps {
  item: FeatureItem;
  index: number;
  onPress: () => void;
}

const FeatureCard = React.memo(({ item, index, onPress }: FeatureCardProps) => {
  const scaleAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scaleAnim.value = withSpring(0.95, { damping: 15 });
      glowAnim.value = withTiming(1, { duration: 200 });
    })
    .onFinalize(() => {
      scaleAnim.value = withSpring(1, { damping: 15 });
      glowAnim.value = withTiming(0, { duration: 300 });
    })
    .onEnd(() => {
      'worklet';
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={FadeInDown.delay(index * 40).duration(400).springify()}
        style={[styles.featureCard, animatedStyle]}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featureIconContainer}
        >
          <Icon name={item.icon} size={moderateScale(22)} color="#FFF" />
        </LinearGradient>

        <View style={styles.featureTextContainer}>
          <Text style={styles.featureTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.featureSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>

        <View style={styles.featureArrowWrap}>
          <Icon name="arrow-top-right" size={moderateScale(14)} color={THEME.textTertiary} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

// Quick Action with glow
interface QuickActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
  glow: string;
}

const QuickAction = React.memo(({ icon, label, onPress, color, glow }: QuickActionProps) => {
  const scaleAnim = useSharedValue(1);
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const gesture = Gesture.Tap()
    .onBegin(() => { scaleAnim.value = withSpring(0.9); })
    .onFinalize(() => { scaleAnim.value = withSpring(1); })
    .onEnd(() => { 'worklet'; runOnJS(onPress)(); });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.quickActionCard, animatedStyle]}>
        <View style={styles.quickActionIconWrap}>
          <Animated.View
            style={[
              styles.quickActionGlow,
              { backgroundColor: glow },
              glowStyle,
            ]}
          />
          <View style={[styles.quickActionIconInner, { backgroundColor: THEME.bgGlassStrong }]}>
            <Icon name={icon} size={moderateScale(22)} color={color} />
          </View>
        </View>
        <Text style={styles.quickActionText} numberOfLines={2}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
});

// --- Main HomeScreen ---

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refetch whenever Home regains focus so marking notifications as read in
  // NotificationScreen is reflected in the badge on return.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      fetchUnreadCount(token).then(count => {
        if (active) {
          setUnreadCount(count);
        }
      });
      return () => {
        active = false;
      };
    }, [token]),
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          'https://api.hiranyagarbhsanskar.co/hiranyagarbha/users/get',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        if (response.ok && data.success) setProfile(data.data || data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  const isTablet = width >= 768;

  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? 'Good Morning'
      : currentDate.getHours() < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const p = profile || user || {};
  const pregnancyWeek = p.pregnancyWeek ? parseInt(String(p.pregnancyWeek)) : null;
  const dueDateStr = p.dueDate
    ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Oct 15';
  const currentWeek = pregnancyWeek || 24;
  const babyWeightGrams = Math.round(100 + currentWeek * 25);
  const babyWeight =
    babyWeightGrams >= 1000
      ? `${(babyWeightGrams / 1000).toFixed(1)}kg`
      : `${babyWeightGrams}g`;

  const dailyTips = [
    { title: 'Stay Hydrated', text: 'Drink 8-10 glasses of water daily to maintain amniotic fluid levels and support fetal development.' },
    { title: 'Gentle Exercise', text: 'A 30-minute walk daily improves circulation, reduces back pain, and boosts mood.' },
    { title: 'Prenatal Vitamins', text: 'Take folic acid and calcium as prescribed for your baby\'s brain and bone development.' },
    { title: 'Talk to Baby', text: 'Your baby can hear your voice from week 24. Read or sing daily to strengthen your bond.' },
  ];
  const dayOfYear = Math.floor(
    (currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const dailyTip = dailyTips[dayOfYear % dailyTips.length];

  const featureData = useMemo(() => pregnancyFeatures, []);

  const handleFeaturePress = (screen: keyof RootStackParamList) => navigation.navigate(screen);
  const handleQuickAction = (screen: keyof RootStackParamList) => navigation.navigate(screen);

  const renderFeature = ({ item, index }: { item: FeatureItem; index: number }) => (
    <FeatureCard item={item} index={index} onPress={() => handleFeaturePress(item.screen)} />
  );

  const progressPercent = Math.min((currentWeek / 40) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      {/* Ambient Aurora Background */}
      <View style={styles.auroraContainer} pointerEvents="none">
        <View style={[styles.auroraBlob, styles.auroraRose]} />
        <View style={[styles.auroraBlob, styles.auroraViolet]} />
        <View style={[styles.auroraBlob, styles.auroraCyan]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* --- FLOATING HEADER --- */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('MyProfile' as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[THEME.rose, THEME.violet]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {p?.name ? p.name.charAt(0).toUpperCase() : 'HG'}
                </Text>
              </LinearGradient>
              <View style={styles.onlineDot} />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: scale(12) }}>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {p?.name ? p.name.split(' ')[0] : 'Welcome'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleFeaturePress('Notification')}
              activeOpacity={0.7}
            >
              <Icon name="bell-outline" size={moderateScale(20)} color={THEME.textPrimary} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Date + Streak pill */}
          <View style={styles.dateRow}>
            <View style={styles.datePill}>
              <Icon name="calendar-blank-outline" size={moderateScale(12)} color={THEME.textSecondary} />
              <Text style={styles.datePillText}>{formatDate(currentDate)}</Text>
            </View>
            <View style={styles.streakPill}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>12 day streak</Text>
            </View>
          </View>
        </Animated.View>

        {/* --- HERO PREGNANCY CARD --- */}
        <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.heroWrapper}>
          <View style={styles.heroCard}>
            {/* Gradient Border Effect */}
            <LinearGradient
              colors={['rgba(255,77,141,0.6)', 'rgba(167,139,250,0.4)', 'rgba(34,211,238,0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradientBorder}
            >
              <View style={styles.heroInner}>
                {/* Header Row */}
                <View style={styles.heroTopRow}>
                  <View>
                    <Text style={styles.heroLabel}>CURRENT WEEK</Text>
                    <View style={styles.heroWeekRow}>
                      <Text style={styles.heroWeekNumber}>{currentWeek}</Text>
                      <Text style={styles.heroWeekSlash}>/40</Text>
                    </View>
                  </View>

                  <View style={styles.heroBadgeWrap}>
                    <LinearGradient
                      colors={['rgba(52,211,153,0.2)', 'rgba(52,211,153,0.1)']}
                      style={styles.heroBadge}
                    >
                      <View style={styles.heroBadgeDot} />
                      <Text style={styles.heroBadgeText}>On Track</Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Circular Progress + Floating Baby */}
                <View style={styles.heroMid}>
                  <View style={styles.progressCircleWrap}>
                    <View style={styles.progressCircleOuter}>
                      <LinearGradient
                        colors={[THEME.rose, THEME.violet, THEME.cyan]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.progressCircleFill,
                          { height: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.progressCircleInner}>
                      <Icon name="baby-face-outline" size={moderateScale(28)} color={THEME.rose} />
                    </View>
                  </View>

                  <View style={styles.heroStatsColumn}>
                    <View style={styles.heroStatBlock}>
                      <Text style={styles.heroStatLabel}>Baby Weight</Text>
                      <Text style={styles.heroStatValue}>{babyWeight}</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStatBlock}>
                      <Text style={styles.heroStatLabel}>Due Date</Text>
                      <Text style={styles.heroStatValue}>{dueDateStr}</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Progress Bar */}
                <View style={styles.heroBottomBar}>
                  <View style={styles.heroBottomTrack}>
                    <LinearGradient
                      colors={[THEME.rose, THEME.violet]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.heroBottomFill, { width: `${progressPercent}%` }]}
                    />
                  </View>
                  <Text style={styles.heroBottomLabel}>
                    {40 - currentWeek} weeks to go
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* --- QUICK ACTIONS --- */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="calendar-check-outline"
              label="Appointment"
              onPress={() => handleQuickAction('Appointment')}
              color={THEME.rose}
              glow={THEME.roseGlow}
            />
            <QuickAction
              icon="shopping-outline"
              label="Shop"
              onPress={() => handleQuickAction('Products')}
              color={THEME.mint}
              glow={THEME.mintGlow}
            />
            <QuickAction
              icon="crown-outline"
              label="Premium"
              onPress={() => handleQuickAction('Premium')}
              color={THEME.amber}
              glow={THEME.amberGlow}
            />
            <QuickAction
              icon="chat-processing-outline"
              label="Support"
              onPress={() => handleQuickAction('ContactUs')}
              color={THEME.violet}
              glow={THEME.violetGlow}
            />
          </View>
        </Animated.View>

        {/* --- FEATURES --- */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featureData}
            keyExtractor={(item) => item.id}
            numColumns={isTablet ? 3 : 2}
            renderItem={renderFeature}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            key={isTablet ? 'tablet' : 'phone'}
          />
        </Animated.View>

        {/* --- DAILY TIP (Glass Card) --- */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tip</Text>
          </View>

          <View style={styles.tipCard}>
            <LinearGradient
              colors={['rgba(251,191,36,0.15)', 'rgba(251,191,36,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipGradient}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIconWrap}>
                  <Icon name="lightbulb-on" size={moderateScale(18)} color={THEME.amber} />
                </View>
                <Text style={styles.tipTitle}>{dailyTip.title}</Text>
              </View>
              <Text style={styles.tipText}>{dailyTip.text}</Text>

              <TouchableOpacity style={styles.tipCTA} activeOpacity={0.7}>
                <Text style={styles.tipCTAText}>Read more</Text>
                <Icon name="arrow-right" size={moderateScale(14)} color={THEME.amber} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* --- PREMIUM BANNER --- */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.section}>
          <View style={styles.premiumWrapper}>
            <LinearGradient
              colors={['#1E1B4B', '#312E81', '#4C1D95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumBanner}
            >
              {/* Decorative circles */}
              <View style={styles.premiumDecor1} />
              <View style={styles.premiumDecor2} />

              <View style={styles.premiumTopRow}>
                <LinearGradient
                  colors={[THEME.amber, '#F59E0B']}
                  style={styles.premiumIconWrap}
                >
                  <Icon name="crown" size={moderateScale(18)} color="#1E1B4B" />
                </LinearGradient>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              </View>

              <Text style={styles.premiumTitle}>
                Unlock Complete{'\n'}Garbh Sanskar
              </Text>
              <Text style={styles.premiumText}>
                Daily activities, expert sessions & personalized guidance.
              </Text>

              <View style={styles.premiumChipsRow}>
                {['100+ Videos', 'Expert', '24/7'].map((f, i) => (
                  <View key={i} style={styles.premiumChip}>
                    <Text style={styles.premiumChipText}>{f}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.premiumButton} activeOpacity={0.85}>
                <LinearGradient
                  colors={[THEME.amber, '#F59E0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Upgrade Now</Text>
                  <Icon name="arrow-right" size={moderateScale(16)} color="#1E1B4B" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>

        <View style={{ height: verticalScale(40) }} />
      </ScrollView>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  contentContainer: { paddingBottom: verticalScale(20) },

  // Aurora Background
  auroraContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  auroraBlob: {
    position: 'absolute',
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
  },
  auroraRose: {
    backgroundColor: THEME.roseGlow,
    top: -scale(100),
    left: -scale(80),
    opacity: 0.4,
  },
  auroraViolet: {
    backgroundColor: THEME.violetGlow,
    top: scale(200),
    right: -scale(120),
    opacity: 0.3,
  },
  auroraCyan: {
    backgroundColor: THEME.cyanGlow,
    bottom: scale(100),
    left: -scale(100),
    opacity: 0.2,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  avatar: { position: 'relative' },
  avatarGradient: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: 6,
    backgroundColor: THEME.mint,
    borderWidth: 2,
    borderColor: THEME.bg,
  },
  greetingText: {
    fontSize: moderateScale(12),
    color: THEME.textSecondary,
    fontWeight: '500',
    marginBottom: verticalScale(2),
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.6,
  },
  iconButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    backgroundColor: THEME.bgGlass,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    minWidth: moderateScale(16),
    height: moderateScale(16),
    borderRadius: 8,
    backgroundColor: THEME.rose,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4),
    borderWidth: 2,
    borderColor: THEME.bg,
  },
  notificationBadgeText: {
    fontSize: moderateScale(8),
    color: '#FFF',
    fontWeight: '800',
  },

  // Date + Streak row
  dateRow: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: THEME.bgGlass,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
  },
  datePillText: {
    fontSize: moderateScale(11),
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.25)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
  },
  streakEmoji: { fontSize: moderateScale(11) },
  streakText: {
    fontSize: moderateScale(11),
    color: THEME.amber,
    fontWeight: '700',
  },

  // Hero Card
  heroWrapper: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(8),
  },
  heroCard: {
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    shadowColor: THEME.rose,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  heroGradientBorder: {
    padding: 1.5,
    borderRadius: moderateScale(24),
  },
  heroInner: {
    backgroundColor: '#0F0F1A',
    borderRadius: moderateScale(22.5),
    padding: moderateScale(20),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  heroLabel: {
    fontSize: moderateScale(10),
    color: THEME.textTertiary,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: verticalScale(6),
  },
  heroWeekRow: { flexDirection: 'row', alignItems: 'baseline' },
  heroWeekNumber: {
    fontSize: moderateScale(44),
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -2,
    lineHeight: moderateScale(46),
  },
  heroWeekSlash: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: THEME.textTertiary,
    marginLeft: scale(2),
  },
  heroBadgeWrap: {},
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  heroBadgeDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: 3,
    backgroundColor: THEME.mint,
  },
  heroBadgeText: {
    fontSize: moderateScale(10),
    color: THEME.mint,
    fontWeight: '700',
  },

  // Hero Mid
  heroMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
    marginBottom: verticalScale(20),
  },
  progressCircleWrap: {
    width: moderateScale(90),
    height: moderateScale(90),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircleOuter: {
    position: 'absolute',
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  progressCircleFill: {
    width: '100%',
    opacity: 0.6,
  },
  progressCircleInner: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: THEME.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.borderStrong,
  },

  heroStatsColumn: {
    flex: 1,
    gap: verticalScale(12),
  },
  heroStatBlock: {},
  heroStatLabel: {
    fontSize: moderateScale(10),
    color: THEME.textTertiary,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: verticalScale(4),
  },
  heroStatValue: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.5,
  },
  heroStatDivider: {
    height: 1,
    backgroundColor: THEME.border,
  },

  // Hero Bottom
  heroBottomBar: {},
  heroBottomTrack: {
    height: verticalScale(4),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: moderateScale(2),
    overflow: 'hidden',
    marginBottom: verticalScale(8),
  },
  heroBottomFill: {
    height: '100%',
    borderRadius: moderateScale(2),
  },
  heroBottomLabel: {
    fontSize: moderateScale(11),
    color: THEME.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },

  // Sections
  section: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(28),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.4,
  },
  seeAllText: {
    fontSize: moderateScale(12),
    color: THEME.rose,
    fontWeight: '700',
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: THEME.bgGlass,
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: THEME.border,
  },
  quickActionIconWrap: {
    position: 'relative',
    width: moderateScale(48),
    height: moderateScale(48),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  quickActionGlow: {
    position: 'absolute',
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  quickActionIconInner: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.borderStrong,
  },
  quickActionText: {
    fontSize: moderateScale(10.5),
    color: THEME.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Feature Cards
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  featureCard: {
    width: '48.5%',
    backgroundColor: THEME.bgGlass,
    borderRadius: moderateScale(18),
    padding: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
    gap: scale(10),
  },
  featureIconContainer: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: { flex: 1 },
  featureTitle: {
    fontSize: moderateScale(12.5),
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: verticalScale(2),
    letterSpacing: -0.2,
  },
  featureSubtitle: {
    fontSize: moderateScale(9.5),
    color: THEME.textTertiary,
    fontWeight: '500',
  },
  featureArrowWrap: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Daily Tip
  tipCard: {
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
  },
  tipGradient: { padding: moderateScale(18) },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(10),
  },
  tipIconWrap: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(251,191,36,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: moderateScale(12.5),
    color: THEME.textSecondary,
    lineHeight: verticalScale(19),
    marginBottom: verticalScale(12),
  },
  tipCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    alignSelf: 'flex-start',
  },
  tipCTAText: {
    fontSize: moderateScale(12),
    color: THEME.amber,
    fontWeight: '700',
  },

  // Premium Banner
  premiumWrapper: {
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  premiumBanner: {
    borderRadius: moderateScale(24),
    padding: moderateScale(22),
    position: 'relative',
    overflow: 'hidden',
  },
  premiumDecor1: {
    position: 'absolute',
    top: -scale(40),
    right: -scale(40),
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    backgroundColor: 'rgba(251,191,36,0.08)',
  },
  premiumDecor2: {
    position: 'absolute',
    bottom: -scale(60),
    left: -scale(40),
    width: scale(180),
    height: scale(180),
    borderRadius: scale(90),
    backgroundColor: 'rgba(255,77,141,0.06)',
  },
  premiumTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  premiumIconWrap: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    backgroundColor: 'rgba(251,191,36,0.15)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  premiumBadgeText: {
    fontSize: moderateScale(9),
    color: THEME.amber,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  premiumTitle: {
    fontSize: moderateScale(22),
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.8,
    lineHeight: moderateScale(26),
    marginBottom: verticalScale(10),
  },
  premiumText: {
    fontSize: moderateScale(12.5),
    color: 'rgba(255,255,255,0.7)',
    lineHeight: verticalScale(18),
    marginBottom: verticalScale(16),
  },
  premiumChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(20),
  },
  premiumChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: THEME.border,
  },
  premiumChipText: {
    fontSize: moderateScale(10.5),
    color: '#FFF',
    fontWeight: '700',
  },
  premiumButton: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(15),
    gap: scale(8),
  },
  premiumButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;