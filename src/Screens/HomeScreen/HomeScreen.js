import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import metrics from '../../Constants/Metrics';
import CustomImageSlider from '../../Components/imageSlider/CustomImageSlider';
import {moderateScale, scale, verticalScale} from '../../Constants/Scalling';
import {Fonts} from '../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import {Instance} from '../../API/Instance';
import CategoryList from '../../Components/Category/CategoryList';
import SecondCategory from '../../Components/Category/SecondCategory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={AllColors.primary400} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const FloatingKara = ({size, top, left, right, bottom, opacity}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.karaCircle,
        {
          width: size,
          height: size,
          top,
          left,
          right,
          bottom,
          opacity,
          transform: [{scale: pulseAnim}],
        },
      ]}
    />
  );
};

export default function HomeScreen({navigation}) {
  const [nutritionData, setNutritionData] = useState([]);
  const [dailyMantrasData, setDailyMantrasData] = useState([]);
  const [homeRemediesData, setHomeRemediesData] = useState([]);
  const [yogaData, setYogaData] = useState([]);
  const [dailyStoryData, setDailyStoryData] = useState([]);
  const [raagSanskarData, setRaagSanskarData] = useState([]);
  const [garbhaSamvadData, setGarbhaSamvadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  // Unified fetch for all sections
  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (!isActive) {return;}
        if (response.data?.success) {
          const data = response.data.data || [];
          setNutritionData(data);
          setDailyMantrasData(data);
          setHomeRemediesData(data);
          setYogaData(data);
          setDailyStoryData(data);
          setRaagSanskarData(data);
          setGarbhaSamvadData(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        if (isActive) {setLoading(false);}
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {return;}
        const response = await Instance.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const profile = response.data.data;
          setUserName(profile.name || (profile.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'User'));
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good night');
    }
  }, []);

  const renderItemRemedies = ({item}) => (
    <TouchableOpacity
      style={styles.remedyCard}
      onPress={() =>
        navigation.navigate('RemediesDetails', {remedyData: item})
      }>
      <View style={styles.remedyContent}>
        <Text style={styles.remedyTitle} numberOfLines={2}>{item.title}</Text>
<Icon
           name="chevron-forward-outline"
           size={moderateScale(22)}
           color={AllColors.gray}
           style={styles.iconStyle}
         />
      </View>
    </TouchableOpacity>
  );

return (
    <Container backgroundColor={AllColors.white}>
      <View style={styles.headerView}>
        <LinearGradient
          colors={['#FFD871', '#FFC546', '#FFA63D']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientBackground}
        />
        <FloatingKara size={80} top={-20} right={-20} opacity={0.1} />
        <FloatingKara size={60} bottom={10} left={-10} opacity={0.08} />
        <FloatingKara size={40} top={50} left={30} opacity={0.06} />
        <View style={styles.headerContent}>
          <CustomHeader
            type="home"
            greeting={greeting}
            userName={userName || 'User'}
            profilePicUrl="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid"
            onPressProfilePic={() => {
              navigation.navigate('ProfileScreen');
            }}
            onPressChatIcon={() => {
              navigation.navigate('ChatListScreen');
            }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sliderContainer}>
          <CustomImageSlider />
        </View>

        <View style={styles.contentContainer}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <CategoryList
              data={nutritionData}
              title="Nutrition and Diet"
              navigation={navigation}
              routeName="NutritionDetails"
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <CategoryList
              data={dailyMantrasData}
              title="Daily mantras and chants"
              navigation={navigation}
              routeName="MantrasandChantsDetails"
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <CategoryList
              data={homeRemediesData}
              title="Home Remedies"
              navigation={navigation}
              routeName="RemediesDetails"
              customRenderItem={renderItemRemedies}
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <CategoryList
              data={yogaData}
              title="Yoga & Exercises"
              navigation={navigation}
              routeName="YogaDetails"
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <SecondCategory
              title="Daily Story"
              data={dailyStoryData}
              navigation={navigation}
              routeName="DailyStoryDetails"
              onPressItem={(item) => navigation.navigate('DailyStoryDetails', { dailydetailsData: item })}
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <SecondCategory
              title="Raag Sanskar"
              data={raagSanskarData}
              navigation={navigation}
              routeName="RaagSanskarDetails"
              onPressItem={(item) => navigation.navigate('RaagSanskarDetails', { RaagSanskarData: item })}
            />
          )}

          {loading ? (
            <LoadingComponent />
          ) : (
            <SecondCategory
              title="Garbha Samvad"
              data={garbhaSamvadData}
              navigation={navigation}
              routeName="GarbhaSmvadDetails"
              onPressItem={(item) => navigation.navigate('GarbhaSmvadDetails', { GarbhaData: item })}
            />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: metrics.hp12,
    backgroundColor: 'transparent',
    paddingTop: 0,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  karaCircle: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: AllColors.white,
  },
  sliderContainer: {
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10),
  },
  contentContainer: {
    paddingHorizontal: scale(5),
    paddingTop: verticalScale(20),
    backgroundColor: AllColors.white,
    borderTopLeftRadius: scale(25),
    borderTopRightRadius: scale(25),
    marginTop: verticalScale(-15),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },

  CategoryMainView: {
    marginTop: scale(10),
  },
  Label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(21),
    paddingHorizontal: scale(15),
  },
  flatListContainer: {
    paddingTop: verticalScale(10),
    paddingLeft: 15,
  },
  itemContainer: {
    width: scale(150),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(5),
  },
  itemImage: {
    width: '100%',
    height: verticalScale(120),
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(16),
    color: AllColors.black,
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  remedyCard: {
    marginRight: scale(15),
    backgroundColor: AllColors.lightPurple,
    borderRadius: moderateScale(16),
    padding: scale(12),
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: verticalScale(60),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(173, 216, 230, 0.3)',
  },
  remedyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconStyle: {
    top: 2,
    marginLeft: scale(10),
  },
  remedyTitle: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(16),
    color: AllColors.text500,
    flex: 1,
    lineHeight: moderateScale(20),
  },

  garbhaCard: {
    flexDirection: 'row',
    backgroundColor: AllColors.white,
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
    padding: scale(5),
    alignItems: 'center',
    borderWidth: 0.3,
  },

  garbhaImage: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: 10,
    marginRight: scale(10),
    resizeMode: 'cover',
  },

  garbhaDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  garbhaTitle: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(16),
    color: AllColors.black,
    textAlign: 'left',
  },
  loadingContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(16),
    color: AllColors.subText,
  },
});
