import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
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

const TabBarIcon = ({ emoji, color, size }: { emoji: string; color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>{emoji}</Text>
);

const homeIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="🏠" />;
const garbhSanskarIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="🧘" />;
const productsIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="🛍️" />;
const profileIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="👤" />;
const tipsIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="📝" />;
const symptomsIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="⚕️" />;
const babyNamesIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="👶" />;
const nutritionIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="🥗" />;
const exerciseIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="🏃" />;
const premiumIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="👑" />;
const communityIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="👥" />;
const appointmentIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="📅" />;
const growthIcon = (props: { color: string; size: number }) => <TabBarIcon {...props} emoji="📊" />;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#D6336C',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: homeIcon,
        }}
      />
      <Tab.Screen
        name="GarbhSanskar"
        component={GarbhSanskarPage}
        options={{
          title: 'Garbh Sanskar',
          tabBarIcon: garbhSanskarIcon,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductPage}
        options={{
          title: 'Products',
          tabBarIcon: productsIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: profileIcon,
        }}
      />
      
      <Tab.Screen
        name="Symptoms"
        component={SymptomsScreen}
        options={{ title: 'Symptoms', tabBarIcon: homeIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="BabyNames"
        component={BabyNamesScreen}
        options={{ title: 'Baby Names', tabBarIcon: homeIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{ title: 'Nutrition', tabBarIcon: homeIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ title: 'Exercise', tabBarIcon: homeIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ title: 'Premium', tabBarIcon: homeIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: 'Community', tabBarIcon: communityIcon }}
      />
      <Tab.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{ title: 'Appointment', tabBarIcon: appointmentIcon, tabBarItemStyle: { display: 'none' } }}
      />
      <Tab.Screen
        name="GrowthTracking"
        component={GrowthTrackingScreen}
        options={{ title: 'Growth', tabBarIcon: growthIcon, tabBarItemStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
