import * as React from 'react';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Animated, Easing, View,ToastAndroid} from 'react-native';
import OnBoardingScreen from '../Screens/LoginModule/OnBoardingScreen/OnBoardingScreen';
import {_navigationRef} from './navigationRef';
import LoginScreen from '../Screens/LoginModule/LoginScreen/LoginScreen';
import LoginOTP from '../Screens/LoginModule/OTPScreen/VerifyOtp';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import InvestScreen from '../Screens/TabModule/InvestScreen/ShopScreen';
import CustomTabBar from '../Components/CustomTabBar/CustomTabBat';
import AskLoginScreen from '../Screens/LoginModule/OnBoardingScreen/AskLoginScreen';
import PremiumScreen from '../Screens/TabModule/PremiumScreen/PremiumScreen';
import SupportScreen from '../Screens/TabModule/MaketScreen/SupportScreen';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import ProfileScreen from '../Screens/ProfileModule/ProfileScreen/ProfileScreen';
import SplashScreen from '../Screens/LoginModule/SplashScreen/SplashScreen';
import EditProfile from '../Screens/ProfileModule/EditProfile/EditProfileScreen';
import ChangeLanguageScreen from '../Screens/ProfileModule/ChangeLanguageScreen/ChangeLanguageScreen';
import VideoScreen from '../Screens/TabModule/VideoScreen/VideoScreen';
import VideoItemScreen from '../Screens/TabModule/VideoItemScreen/VideoItemScreen';
import LoginWithOtp from '../Screens/LoginModule/LoginScreen/LoginWithOtp';
import ChatScreen from '../Screens/ChatScreen/ChatScreen';
import ChatListScreen from '../Screens/ChatScreen/ChatListScreen';
import ChatNotificationSettings from '../Screens/ChatScreen/ChatNotificationSettings';
import MyOrder from '../Screens/MyOrder/MyOrder';
import OrderTopTab from '../Screens/MyOrder/OrderTopTab';
import Settings from '../Screens/Settings/Settings';
import LMPScreen from '../Screens/LoginModule/LMP Screen/LMPScreen';
import Tearms_Condition from '../Screens/ProfileModule/Tearms_Condition';
import Signup from '../Screens/LoginModule/Signup/Signup';
import Privacy_Policy from '../Screens/ProfileModule/Privacy_Policy';
import LanguageScreen from '../Screens/LoginModule/Language/ChangingLanguage';
import VerifyOtp from '../Screens/LoginModule/OTPScreen/VerifyOtp';
import ForgotPassword from '../Screens/LoginModule/ForgotPassword/ForgotPassword';
import NutritionDetails from '../Screens/HomeScreen/NutritionDetails';
import RemediesDetails from '../Screens/HomeScreen/RemediesDetails';
import YogaDetails from '../Screens/HomeScreen/YogaDetails';
import GarbhaSmvadDetails from '../Screens/HomeScreen/GarbhaSmvadDetails';
import DailyStoryDetails from '../Screens/HomeScreen/DailyStoryDetails';
import RaagSanskarDetails from '../Screens/HomeScreen/RaagSanskarDetails';
import MantrasandChantsDetails from '../Screens/HomeScreen/MantrasandChantsDetails';
import FaqScreen from '../Screens/TabModule/MaketScreen/FaqScreen';
import WhatsAppNotification from '../Screens/WhatsApp/WhatsAppNotification';
import MobileNoLogin from '../Screens/LoginModule/MobileNoLogin/MobileNoLogin';
import MobileNoVerify from '../Screens/LoginModule/MobileNoLogin/MobileNoVerify';
import Sessions from '../Screens/ProfileModule/Sessions';
import SessionDetails from '../Screens/ProfileModule/SessionDetails';

const options2 = {
  headerShown: false,
  transitionSpec: {
    open: {
      animation: 'timing', // Use timing for abrupt animation
      config: {
        duration: 0, // Set duration to 0 for an instant transition
      },
    },
    close: {
      animation: 'timing', // Use timing for abrupt animation
      config: {
        duration: 0, // Set duration to 0 for an instant transition
      },
    },
  },
};

export default function Route() {
  const StackObj = createNativeStackNavigator();
  const TabObj = createBottomTabNavigator();

  const TabNavigator = () => {
    return (
      /* @ts-ignore */
      <TabObj.Navigator
        initialRouteName="Home"
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}>
        <TabObj.Screen
          name="Premium"
          component={PremiumScreen}
          options={{headerShown: false}}
        />
        <TabObj.Screen
          name="Store"
          component={InvestScreen}
          options={{headerShown: false}}
        />
        <TabObj.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <TabObj.Screen
          name="Support"
          component={SupportScreen}
          options={{headerShown: false}}
        />
        <TabObj.Screen
          name="More"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      </TabObj.Navigator>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <NavigationContainer ref={_navigationRef}>
        <StackObj.Navigator screenOptions={{autoHideHomeIndicator: true}}>
          <StackObj.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <StackObj.Screen
            name={'OnBoardingScreen'}
            component={OnBoardingScreen}
            options={options2}
          />
          <StackObj.Screen
            name={'AskLoginScreen'}
            component={AskLoginScreen}
            options={options2}
          />

          <StackObj.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name="EditProfile"
            component={EditProfile}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name="ChangeLanguageScreen"
            component={ChangeLanguageScreen}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name="VideoScreen"
            component={VideoScreen}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name="VideoItemScreen"
            component={VideoItemScreen}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name={'LoginScreen'}
            component={LoginScreen}
            options={options2}
          />
          <StackObj.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{headerShown: false}}
          />

          <StackObj.Screen
            name={'VerifyOtp'}
            component={VerifyOtp}
            options={options2}
          />
            <StackObj.Screen
            name={'LoginWithOtp'}
            component={LoginWithOtp}
            options={options2}
          />
           <StackObj.Screen
            name={'ChatScreen'}
            component={ChatScreen}
            options={options2}
          />
            <StackObj.Screen
            name={'ChatListScreen'}
            component={ChatListScreen}
            options={options2}
          />
            <StackObj.Screen
            name={'ChatNotificationSettings'}
            component={ChatNotificationSettings}
            options={options2}
          />
            <StackObj.Screen
            name={'OrderTopTab'}
            component={OrderTopTab}
            options={options2}
          />
            <StackObj.Screen
            name={'Settings'}
            component={Settings}
            options={options2}
          />
            <StackObj.Screen
            name={'LMPScreen'}
            component={LMPScreen}
            options={options2}
          />
          <StackObj.Screen
            name={'Tearms_Condition'}
            component={Tearms_Condition}
            options={options2}
          />
          <StackObj.Screen
            name={'Signup'}
            component={Signup}
            options={options2}
          />
             <StackObj.Screen
            name={'Privacy_Policy'}
            component={Privacy_Policy}
            options={options2}
          />
          <StackObj.Screen
            name={'LanguageScreen'}
            component={LanguageScreen}
            options={options2}
          />
           <StackObj.Screen
            name={'ForgotPassword'}
            component={ForgotPassword}
            options={options2}
          />
           <StackObj.Screen
            name={'NutritionDetails'}
            component={NutritionDetails}
            options={options2}
          />
          <StackObj.Screen
            name={'RemediesDetails'}
            component={RemediesDetails}
            options={options2}
          />
            <StackObj.Screen
            name={'YogaDetails'}
            component={YogaDetails}
            options={options2}
          />
          <StackObj.Screen
            name={'GarbhaSmvadDetails'}
            component={GarbhaSmvadDetails}
            options={options2}
          />
           <StackObj.Screen
            name={'DailyStoryDetails'}
            component={DailyStoryDetails}
            options={options2}
          />
          <StackObj.Screen
            name={'RaagSanskarDetails'}
            component={RaagSanskarDetails}
            options={options2}
          />
          <StackObj.Screen
            name={'MantrasandChantsDetails'}
            component={MantrasandChantsDetails}
            options={options2}
          />
           <StackObj.Screen
            name={'FaqScreen'}
            component={FaqScreen}
            options={options2}
          />
          <StackObj.Screen
            name={'WhatsAppNotification'}
            component={WhatsAppNotification}
            options={options2}
          />
           <StackObj.Screen
            name={'MobileNoLogin'}
            component={MobileNoLogin}
            options={options2}
          />
            <StackObj.Screen
            name={'MobileNoVerify'}
            component={MobileNoVerify}
            options={options2}
          />
            <StackObj.Screen
            name={'Sessions'}
            component={Sessions}
            options={options2}
          />
          <StackObj.Screen
            name={'SessionDetails'}
            component={SessionDetails}
            options={options2}
          />
        </StackObj.Navigator>
      </NavigationContainer>
    </View>
  );
}
