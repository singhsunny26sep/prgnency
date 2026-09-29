import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import HomeScreen from '../Screens/HomeScreen';
import ProductPage from '../Screens/ProductPage';
import GarbhSanskarPage from '../Screens/GarbhSanskarPage';
import ProfileScreen from '../Screens/ProfileScreen';
import WeeklyTipsScreen from '../Screens/WeeklyTipsScreen';
import SymptomsScreen from '../Screens/SymptomsScreen';
import BabyNamesScreen from '../Screens/BabyNamesScreen';
import NutritionScreen from '../Screens/NutritionScreen';
import ExerciseScreen from '../Screens/ExerciseScreen';
import PremiumScreen from '../Screens/PremiumScreen';
import CommunityScreen from '../Screens/CommunityScreen';
import AppointmentScreen from '../Screens/AppointmentScreen';
import GrowthTrackingScreen from '../Screens/GrowthTrackingScreen';
import PlanDetailsScreen from '../Screens/PlanDetailsScreen';

export type TabParamList = {
  HomeTab: undefined;
  GarbhSanskar: undefined;
  Products: undefined;
  Profile: undefined;
  WeeklyTips: undefined;
  Symptoms: undefined;
  BabyNames: undefined;
  Nutrition: undefined;
  Exercise: undefined;
  Premium: undefined;
  Community: undefined;
  Appointment: undefined;
  GrowthTracking: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// --- AURORA THEME (matches HomeScreen THEME object) ---
const THEME = {
  bg: '#0A0A0F',
  bgElevated: '#0F0F1A',
  bgGlass: 'rgba(255,255,255,0.04)',
  bgGlassStrong: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textTertiary: 'rgba(255,255,255,0.35)',
  rose: '#FF4D8D',
  roseGlow: 'rgba(255,77,141,0.4)',
  violet: '#A78BFA',
  violetGlow: 'rgba(167,139,250,0.4)',
  cyan: '#22D3EE',
  cyanGlow: 'rgba(34,211,238,0.4)',
  amber: '#FBBF24',
  amberGlow: 'rgba(251,191,36,0.4)',
  mint: '#34D399',
  mintGlow: 'rgba(52,211,153,0.4)',
};

// --- Tab config (gradients from HomeScreen features) ---
interface TabConfig {
  icon: string;
  activeIcon: string;
  colors: [string, string];
  glow: string;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  HomeTab: {
    icon: 'home-outline',
    activeIcon: 'home',
    colors: [THEME.rose, '#D6336C'],
    glow: THEME.roseGlow,
  },
  GarbhSanskar: {
    icon: 'meditation',
    activeIcon: 'meditation',
    colors: [THEME.violet, '#7C3AED'],
    glow: THEME.violetGlow,
  },
  Products: {
    icon: 'shopping-outline',
    activeIcon: 'shopping',
    colors: ['#FB7185', '#E11D48'],
    glow: 'rgba(251,113,133,0.4)',
  },
  Community: {
    icon: 'account-group-outline',
    activeIcon: 'account-group',
    colors: ['#60A5FA', '#2563EB'],
    glow: 'rgba(96,165,250,0.4)',
  },
  Profile: {
    icon: 'account-outline',
    activeIcon: 'account',
    colors: [THEME.amber, '#F59E0B'],
    glow: THEME.amberGlow,
  },
};

const VISIBLE_TABS: (keyof TabParamList)[] = [
  'HomeTab',
  'GarbhSanskar',
  'Products',
  'Community',
  'Profile',
];

const HIDDEN_TAB_STYLE = { display: 'none' as const };

// --- Animated Tab Item ---
interface TabItemProps {
  focused: boolean;
  config: TabConfig;
  label: string;
  onPress: () => void;
}

const TabItem = React.memo(({ focused, config, label, onPress }: TabItemProps) => {
  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 14,
      stiffness: 140,
    });
  }, [focused]);

  const iconScaleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 1.08]) },
      { translateY: interpolate(progress.value, [0, 1], [0, -2]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
    >
      <View style={styles.tabIconWrapper}>
        {/* Glow behind active icon */}
        <Animated.View
          style={[
            styles.tabIconGlow,
            { backgroundColor: config.glow },
            glowStyle,
          ]}
        />

        {/* Icon container */}
        <Animated.View style={[styles.tabIconCircle, iconScaleStyle]}>
          {focused ? (
            <LinearGradient
              colors={config.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tabIconGradient}
            >
              <Icon name={config.activeIcon} size={moderateScale(20)} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={styles.tabIconInactive}>
              <Icon name={config.icon} size={moderateScale(20)} color={THEME.textSecondary} />
            </View>
          )}
        </Animated.View>
      </View>

      <Animated.Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelActive : styles.tabLabelInactive,
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>

      {/* Active dot indicator */}
      {focused && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );
});

// --- Custom Tab Bar ---
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.tabBarWrapper}>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom * 0.6 : verticalScale(10),
          },
        ]}
      >
        {/* Top hairline glow */}
        <LinearGradient
          colors={['transparent', 'rgba(255,77,141,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tabBarTopGlow}
        />

        <View style={styles.tabBarInner}>
          {VISIBLE_TABS.map(tabName => {
            const routeIndex = state.routes.findIndex(r => r.name === tabName);
            if (routeIndex === -1) return null;

            const route = state.routes[routeIndex];
            const isFocused = state.index === routeIndex;
            const config = TAB_CONFIG[tabName];
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : typeof options.title === 'string'
                ? options.title
                : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TabItem
                key={tabName}
                focused={isFocused}
                config={config}
                label={label}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="GarbhSanskar" component={GarbhSanskarPage} options={{ title: 'Sanskar' }} />
      <Tab.Screen name="Products" component={ProductPage} options={{ title: 'Shop' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Community' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    
      

      {/* Hidden screens */}
      <Tab.Screen name="WeeklyTips" component={WeeklyTipsScreen} options={{ title: 'Weekly Tips', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="Symptoms" component={SymptomsScreen} options={{ title: 'Symptoms', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="BabyNames" component={BabyNamesScreen} options={{ title: 'Baby Names', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} options={{ title: 'Nutrition', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'Exercise', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Appointment', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
      <Tab.Screen name="GrowthTracking" component={GrowthTrackingScreen} options={{ title: 'Growth', tabBarItemStyle: HIDDEN_TAB_STYLE }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  // Wrapper keeps the bar from touching screen edges (floating effect)
  tabBarWrapper: {
    backgroundColor: 'black',
    // paddingHorizontal: scale(16),
    paddingBottom: verticalScale(8),
  },
  tabBar: {
    backgroundColor: THEME.bgElevated,
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: THEME.border,
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(6),
    position: 'relative',
    overflow: 'hidden',
    // Premium glow shadow
    shadowColor: THEME.rose,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },
  // Top hairline gradient glow
  tabBarTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(2),
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(52),
    height: moderateScale(40),
    position: 'relative',
  },
  // Pulsing glow behind active icon
  tabIconGlow: {
    position: 'absolute',
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
  },
  tabIconCircle: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(13),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconInactive: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(13),
    backgroundColor: THEME.bgGlass,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  tabLabel: {
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  tabLabelActive: {
    fontSize: moderateScale(10),
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.2,
  },
  tabLabelInactive: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: THEME.textSecondary,
    letterSpacing: -0.1,
  },
  // Small dot under active tab
  activeDot: {
    position: 'absolute',
    bottom: -verticalScale(2),
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: THEME.rose,
  },
});

export default TabNavigator;