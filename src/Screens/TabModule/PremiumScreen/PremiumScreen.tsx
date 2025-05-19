import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  ListRenderItemInfo,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ToastAndroid
} from 'react-native';
import { Images } from '../../../Assets/Images';
import { styles } from './styles';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts, fontSize } from '../../../Constants/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Instance from '../../../API/Apis';
import { useDispatch, useSelector } from 'react-redux';
import { actionTypes } from '../../../Redux/ActionTypes';
import { RootState } from '../../../Redux';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import strings from '../../../../localization';
import usePhonePePayment from '../../../Components/phonepay/usePhonePePayment';
import { moderateScale, scale } from '../../../Constants/Scalling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Container } from '../../../Components/Container/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PremiumScreenProps {
  navigation: NavigationProp<any, any>;
} 

interface Item {
  _id: string;
  isAvailable: boolean;
  name: string;
}

interface Data {
  advancedMaterial: Item[];
  dailyActivities: Item[];
  expertSessions: Item[];
  familyHarmony: Item[];
  support: Item[];
  workshops: Item[];
  yogaDiet: Item[];
}

const PremiumScreen = (props: PremiumScreenProps) => {

  const { submitHandler } = usePhonePePayment();

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await Instance.get('/plans');
        if (response.data.success) {
          setPlans(response.data.data); 
          response.data.data.forEach((plan: any) => {
            console.log('Plan ID:', plan._id); 
          }); 
        } else {
          setError('Failed to load plans.');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('An error occurred while fetching plans.');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchPlans(); 
  }, []);

  const renderFeatureItem = ({ item }: { item: { name: string; isAvailable: boolean } }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{item.name}</Text>
        <View style={styles.statusContainer}>
          <Ionicons
            name={item.isAvailable ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={item.isAvailable ? AllColors.lightBlue : AllColors.red}
          />
          <Text
            style={[styles.statusText, { color: item.isAvailable ? AllColors.lightBlue : AllColors.red }]}
          >
            {item.isAvailable ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFeatureCategory = (category: string, featuresData: any[]) => (
    <View style={styles.featureSection}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={featuresData}
        renderItem={renderFeatureItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );

  const handlePlanSelection = (planIndex: number) => {
    setSelectedPlan(planIndex);
  };


const handlePayment = async () => {
  const selectedPlanData = plans[selectedPlan];
  const totalPrice = selectedPlanData.price.discounted;
  const planId = selectedPlanData._id;
  const token = await AsyncStorage.getItem('userToken'); 
  if (!token) {
    Alert.alert('Authentication Error', 'You are not logged in. Please log in again.');
    return; 
  }
  try {
    const paymentResponse = await submitHandler(totalPrice);

    if (paymentResponse.status === 'SUCCESS') {
      const paymentData = {
        planId: planId,
        paidAmount: totalPrice.toString(),
        paymentStatus: 'paid',
      };
      const response = await Instance.post(
        '/plans/subscription',
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        Alert.alert('Subscription Updated', 'Your subscription status has been updated.');
      } else {
        Alert.alert('Subscription Update Failed', 'Something went wrong while updating your subscription.');
      }
    } else {
    console.log('Payment Failed', paymentResponse.errorMessage || 'Please try again.');
    }
  } catch (err) {
    console.error('Error during payment or API request:', err);
    
    if (err.response && err.response.status === 400) {
      ToastAndroid.show('Subscription is already taken. Please contact admin.', ToastAndroid.LONG);
    } else {
      Alert.alert('Error', 'An error occurred during payment or subscription update.');
    }
  }
};


  const getPlanBackgroundColor = (planIndex: number) => {

    switch (planIndex) {
      case 0: 
        return AllColors.lightPurple; 
      case 1:
        return AllColors.lightGreen; 
      case 2: 
        return AllColors.babyYellow; 
      default:
        return AllColors.white;
    }
  };

  return (
    <Container 
    statusBarStyle={'light-content'}
    statusBarBackgroundColor={AllColors.lightBlue}
    backgroundColor={AllColors.white}>
      <View style={styles.headerView}>
        <CustomHeader
          type="Details"
          screenName={strings.Premium}
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>
      <View style={styles.container1}>
        <ScrollView>
          <KeyboardAwareScrollView style={{ backgroundColor: AllColors.white }}>
            <View style={styles.topHeaderView}>
              <Text style={styles.InvestText}>{strings.bestinvestement}</Text>
              <Text style={styles.yourChildText}>{strings.yourchild}</Text>
            </View>
            <View style={styles.bottomHeaderView}>
              <View style={styles.flexRowView}>
                {plans.map((plan, index) => (
                  <TouchableOpacity
                    key={plan._id}
                    style={[
                      styles.lightPurpleView,
                      {
                        backgroundColor: getPlanBackgroundColor(index),
                        height: selectedPlan === index ? metrics.hp20 : metrics.hp18,
                        width: metrics.hp14,
                        marginTop: selectedPlan === index ? -10 : 0,
                        borderWidth: selectedPlan === index ? 3 : 0,
                        borderColor: selectedPlan === index ? AllColors.text100 : AllColors.transparentColor,
                      },
                    ]}
                    onPress={() => handlePlanSelection(index)}
                  >
                    <Text style={styles.silverText}>{plan.category}</Text>
                    <View style={styles.offView}>
                      <Text style={[styles.silverText, { top: 0, fontSize: fontSize(12) }]}>
                        {plan.price.discountPercentage}% off
                      </Text>
                    </View>
                    <View style={styles.whiteBGView}>
                      <Text style={[styles.silverText, styles.lineAmount]}>
                        {`₹${plan.price.original}`}
                      </Text>
                      <Text style={[styles.silverText]}>{`₹${plan.price.discounted}`}</Text>
                      <Text style={[styles.silverText, styles.lineAmount, { textDecorationLine: 'none', textAlign: 'center' }]}>
                        {plan.price.gstIncluded ? '(Inc. GST)' : '(Ex. GST)'}
                      </Text>
                      <Text style={[styles.lineAmount, { textDecorationLine: 'none', textAlign: 'center' }]}>
                        {plan.duration} Month(s)
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.feautureMaincard}>
              <Text style={styles.titletxt}>Available features</Text>
              {plans[selectedPlan] && Object.entries(plans[selectedPlan].features).map(([category, data], index) => (
                <View key={index} style={{ marginBottom: scale(8) }}>
                  {renderFeatureCategory(category, data)}
                </View>
              ))}
            </View>
          </KeyboardAwareScrollView>

          <TouchableOpacity onPress={handlePayment} style={styles.Btncontainer}>
            <Text style={[styles.silverText, { top: 12 }]}>{`${strings.pay} ₹${plans[selectedPlan]?.price.discounted}`}</Text>
          </TouchableOpacity>

          <View style={{ bottom: scale(100), marginBottom: scale(70) }}>
            <Text
              style={[
                styles.subTexts,
                {
                  marginTop: -metrics.hp5,
                  marginHorizontal: metrics.hp2,
                  textAlign: 'center',
                },
              ]}
            >
              {strings.premiumtitletxt}
            </Text>
            <View style={[styles.ItemOfFetures, { marginTop: metrics.hp0_6, alignSelf: 'center' }]}>
              <Text style={styles.silverText}>{strings.helpno}</Text>
              <Text style={[styles.silverText, { textDecorationLine: 'underline' }]}>
                +91 1234567890
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
};

export default PremiumScreen;
