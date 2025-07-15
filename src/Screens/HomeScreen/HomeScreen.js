import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import metrics from '../../Constants/Metrics';
import CustomImageSlider from '../../Components/imageSlider/CustomImageSlider';
import {moderateScale, scale, verticalScale} from '../../Constants/Scalling';
import {Fonts} from '../../Constants/Fonts';
import {
  DailyMantraData,
  DailyStoryData,
  NutrutionData,
  RaagSanskarData,
} from '../../Utils/DataBase';
import Icon from 'react-native-vector-icons/Ionicons';
import {HomeRemediesData} from '../../Utils/DataBase';
import {YogaData} from '../../Utils/DataBase';
import {GarbhaSamvadData} from '../../Utils/DataBase';
import {imageUrls} from '../../Utils/DataBase';
import axios from 'axios';
import {Instance} from '../../API/Instance';
import CategoryList from '../../Components/Category/CategoryList';
import SecondCategory from '../../Components/Category/SecondCategory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={AllColors.lightBlue} />
    <Text style={styles.loadingText}>Loading Category</Text>
  </View>
);

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

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          const nutritionData = response.data.data;
          setNutritionData(nutritionData);
          // nutritionData.forEach(item => {
          //   console.log('Item ID: ', item._id);
          // });
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  useEffect(() => {
    const fetchDailyMantrasData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setDailyMantrasData(response.data.data);
        } else {
          console.error('Failed to fetch daily mantras');
        }
      } catch (error) {
        console.error('Error fetching daily mantras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMantrasData();
  }, []);

  useEffect(() => {
    const fetchHomeRemediesData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setHomeRemediesData(response.data.data);
        } else {
          console.error('Failed to fetch home remedies');
        }
      } catch (error) {
        console.error('Error fetching home remedies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeRemediesData();
  }, []);

  useEffect(() => {
    const fetchYogaData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setYogaData(response.data.data);
        } else {
          console.error('Failed to fetch yoga data');
        }
      } catch (error) {
        console.error('Error fetching yoga data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYogaData();
  }, []);

  useEffect(() => {
    const fetchDailyStoryData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setDailyStoryData(response.data.data);
        } else {
          console.error('Failed to fetch daily story data');
        }
      } catch (error) {
        console.error('Error fetching daily story data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyStoryData();
  }, []);

  useEffect(() => {
    const fetchRaagSanskarData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setRaagSanskarData(response.data.data);
        } else {
          console.error('Failed to fetch raag sanskar data');
        }
      } catch (error) {
        console.error('Error fetching raag sanskar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaagSanskarData();
  }, []);

  useEffect(() => {
    const fetchGarbhaSamvadData = async () => {
      try {
        const response = await Instance.get('/api/medias-categories/images');
        if (response.data.success) {
          setGarbhaSamvadData(response.data.data);
        } else {
          console.error('Failed to fetch garbha samvad data');
        }
      } catch (error) {
        console.error('Error fetching garbha samvad data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGarbhaSamvadData();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
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
        <Text style={styles.remedyTitle}>{item.title}</Text>
        <Icon
          name="chevron-forward-outline"
          size={22}
          color={AllColors.gray}
          style={{top: 2, marginLeft: 10}}
        />
      </View>
    </TouchableOpacity>
  );

  const renderItemYoga = ({item}) => (
    <TouchableOpacity
      style={styles.yogaCard}
      onPress={() => navigation.navigate('YogaDetails', {YogaData: item})}>
      <Image source={{uri: item.url}} style={styles.yogaImage} />
      <View style={styles.yogaDetails}>
        <Text style={styles.yogaTitle}>{item.title}</Text>
        {/* <Text style={styles.yogaType}>{item.type}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
        
      <View style={styles.headerView}>
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

      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomImageSlider images={imageUrls} />

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
          <View style={styles.CategoryMainView}>
            <Text style={styles.Label}>Yoga & Exercises</Text>
            <FlatList
              data={yogaData}
              renderItem={renderItemYoga}
              keyExtractor={item => item.id?.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
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
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp1,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    elevation: 22,
    shadowColor: '#000', // iOS
    shadowOffset: {width: 0, height: 2}, // iOS
    shadowOpacity: 0.2, // iOS
    shadowRadius: 4, // iOS
  },
  scrollView: {
    flexGrow: 1,
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
    backgroundColor: '#fadadd',
    borderRadius: 12,
    padding: scale(12),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  remedyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remedyTitle: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(16),
    color: AllColors.black,
    flex: 1,
  },
  yogaCard: {
    width: scale(150),
    marginRight: scale(15),
    backgroundColor: AllColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
  },
  yogaImage: {
    width: '100%',
    height: verticalScale(90),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: 'contain',
    marginTop: 10,
  },
  yogaDetails: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  yogaTitle: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(16),
    color: AllColors.black,
    textAlign: 'center',
  },
  yogaType: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: moderateScale(14),
    color: AllColors.gray,
    textAlign: 'center',
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
    color: AllColors.gray,
  },
});