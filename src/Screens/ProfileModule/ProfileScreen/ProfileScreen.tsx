import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ImageBackground,
  FlatList,
} from 'react-native';
import {CommonActions, NavigationProp} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import {Images} from '../../../Assets/Images';
import {styles} from './style';
import MenuItem from './MenuItem';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import {_navigationRef} from '../../../Navigation/navigationRef';
import {useEffect, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {RootState} from '../../../Redux';
import strings from '../../../../localization';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Instance } from '../../../API/Instance';

interface ProfileScreenProps {
  navigation: NavigationProp<any, any>;
}

 

interface JsData {
  address: {
    city: '';
    pinCode: 90001;
    location: '';
    State: '';
  };
  _id: '';
  email: '';
  role: '';
  isVerified: true;
  createdAt: '';
  updatedAt: '';
  __v: 0;
  dateOfBirth: '';
  firstName: '';
  gender: '';
  lastName: '';
  mobile: '';
  profilePic: '';
}

const ProfileScreen = (props: ProfileScreenProps) => {
  const [profile, setProfile] = useState<JsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await Instance.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          console.log('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const menuItems = [
    {
      title: strings.ProductsPlans,
      iconName: Images.newproduct,
      onPress: () => props.navigation.navigate('Premium'),
    },
    {
      title: strings.MyOrder,
      iconName: Images.order,
      onPress: () => props.navigation.navigate('OrderTopTab'),
      },
    {
      title: strings.changeLanguage,
      iconName: Images.languages,
      onPress: () => props.navigation.navigate('ChangeLanguageScreen'),
    },

    {
      title: strings.PrivacyPolicy,
      iconName: Images.privacy,
      onPress: () => props.navigation.navigate('Privacy_Policy'),
    },
    {
      title: strings.TermsCondition,
      iconName: Images.terms,
      onPress: () => props.navigation.navigate('Tearms_Condition'),
    },
    {
      title: strings.Subscription,
      iconName: Images.subscription,
      onPress: () => console.log('Invite friends'),
    },
    {
      title: strings.setting,
      iconName: Images.setting,
      onPress: () => props.navigation.navigate('Settings'),
    },
    {
      title: strings.Logout,
      iconName: Images.logout,
      onPress: () => handleLogout()   
     },
  ];
  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              props.navigation.navigate('AskLoginScreen');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const   renderItem = ({item}: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.iconAndText}>
        <Animated.View style={styles.iconWrapper}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={item.iconName}
          />
        </Animated.View>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container 
     statusBarStyle={'dark-content'}
     statusBarBackgroundColor={AllColors.lightBlue}
     backgroundColor={AllColors.white}>
      {/* Header */}
      <View style={styles.headerView}>
        <CustomHeader
          type="Details"
          screenName={strings.Profile}
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}

        <View style={styles.sepratorSection}>
          {/* <Text style={styles.title}>{strings.myProfile}</Text> */}
        </View>

        <View style={{paddingHorizontal: 16}}>
          <View style={styles.eaderView}>
            <Image
              style={{
                width: metrics.hp10,
                height: metrics.hp10,
                borderRadius: metrics.hp5,
                top: -metrics.hp2,
              }}
              resizeMode="contain"
              source={profile?.profilePic ? { uri: profile.profilePic } : Images.userAvatar}
            /> 
            <View style={styles.userInfo}>
              <Text style={styles.name}>{profile?.name || 'N/A'}</Text>
              <Text style={styles.email}>{profile?.mobile || '7096880152'}</Text>
              <Text style={styles.contact}>{profile?.email || 'N/A'}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                props.navigation.navigate('EditProfile');
              }}>
              <View style={styles.editContent}>
                <Animated.View style={styles.editIconWrapper}>
                  <Image
                    resizeMode="contain"
                    source={Images.edit} 
                    style={styles.editIcon}
                  />
                </Animated.View>
                <Text style={styles.editText}>Edit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <FlatList
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={item => item.title}
            showsVerticalScrollIndicator={false}
            numColumns={2} 
            contentContainerStyle={[styles.container_]}
          />
        </View>
       </ScrollView>
    </Container>
  );
};

export default ProfileScreen;
