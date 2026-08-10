import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import OTPScreen from '../Screens/OTPScreen';
import TabNavigator from './TabNavigator';
import HomeScreen from '../Screens/HomeScreen';
import ProductPage from '../Screens/ProductPage';
import GarbhSanskarPage from '../Screens/GarbhSanskarPage';
import WeeklyTipsScreen from '../Screens/WeeklyTipsScreen';
import SymptomsScreen from '../Screens/SymptomsScreen';
import BabyNamesScreen from '../Screens/BabyNamesScreen';
import NutritionScreen from '../Screens/NutritionScreen';
import ExerciseScreen from '../Screens/ExerciseScreen';
import PremiumScreen from '../Screens/PremiumScreen';
import SplashScreen from '../Screens/SplashScreen';
import ContactUsScreen from '../Screens/ContactUsScreen';
import LanguageScreen from '../Screens/LanguageScreen';
import MyProfileScreen from '../Screens/MyProfileScreen';
import MyOrdersScreen from '../Screens/MyOrdersScreen';
import PrivacyPolicyScreen from '../Screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../Screens/TermsConditionsScreen';
import CommunityScreen from '../Screens/CommunityScreen';
import AppointmentScreen from '../Screens/AppointmentScreen';
import GrowthTrackingScreen from '../Screens/GrowthTrackingScreen';
import MorningDashboardScreen from '../Screens/MorningDashboardScreen';
import { useAuth } from '../Context/AuthContext';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OTP: { mobile: string; sessionId?: string };
  MainTabs: undefined;
  Home: undefined;
  ProductPage: undefined;
  GarbhSanskar: undefined;
  WeeklyTips: undefined;
  Symptoms: undefined;
  BabyNames: undefined;
  Nutrition: undefined;
  Exercise: undefined;
  Premium: undefined;
  MyProfile: undefined;
  MyOrders: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  HelpSupport: undefined;
  ContactUs: undefined;
  Language: undefined;
  Community: undefined;
  Appointment: undefined;
  GrowthTracking: undefined;
  MorningDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Route = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading || authLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainTabs" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductPage" component={ProductPage} options={{ headerShown: false }} />
        <Stack.Screen name="GarbhSanskar" component={GarbhSanskarPage} options={{ headerShown: false }} />
        <Stack.Screen name="WeeklyTips" component={WeeklyTipsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BabyNames" component={BabyNamesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Premium" component={PremiumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GrowthTracking" component={GrowthTrackingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MorningDashboard" component={MorningDashboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;
