import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import { styles } from './style';
import Animated from 'react-native-reanimated';
import { Images } from '../../../Assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import InputField from '../../../Components/CustomInput/InputField';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import metrics from '../../../Constants/Metrics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AllColors } from '../../../Constants/COLORS';
import ImagePicker from 'react-native-image-crop-picker';
import { scale } from '../../../Constants/Scalling';
import { Instance } from '../../../API/Instance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Errors {
  name?: string;
  Lname?: string;
  mobileNumber?: string;
  age?: string;
  pregnancyMonth?: string;
  email?: string;
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

const EditProfile: React.FC = (props: any) => {
  const [name, setName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [LocalImageData, setLocalImageData] = useState<null | any>(null);
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [pregnancyMonth, setPregnancyMonth] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [images, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  
  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo', 
      cropping: true, 
      width: 800, 
      height: 800,
    })
      .then((image) => {
        setLocalImageData(image); 
      })
      .catch((error) => {
        console.log('Error picking image:', error);
      });
  };
  
  const handleSave = async () => {
    setLoading(true);
    const data = {
      email: email,
      name: name,
      mobile: mobileNumber,
      profilePic: LocalImageData ? LocalImageData.path : images, 
      pragnancyMonth: pregnancyMonth,
      age: age,
    };

    const token = await AsyncStorage.getItem('userToken');
    console.log('Token:', token); 
    if (!token) {
      console.log('Token is missing or expired');
      setLoading(false);
      return; 
    }
    try {
      const response = await Instance.put(
        '/api/users/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 200) {
        console.log('Profile updated successfully', response.data);
          props.navigation.goBack();
          if (Platform.OS === 'android') {
          ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log('Error updating profile:', error.response?.data || error.message);
    }
    finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerView}>
        <CustomHeader
          type="back"
          screenName="Edit Profile"
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>

      <KeyboardAwareScrollView
        style={styles.marginView}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS == 'ios' ? 0 : 40}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View>
            <View style={styles.avatarContainer}>
            <Animated.View>
    <Image
      style={{
        width: scale(95),
        height: scale(95),
        borderRadius: metrics.hp7,
      }}
      resizeMode="contain"
      source={
        LocalImageData
          ? { uri: LocalImageData.path } 
          : images
          ? { uri: images }
          : Images.userAvatar 
      }
    />
  </Animated.View>


              <TouchableOpacity
                style={styles.editPhotoButton}
                onPress={onPressGallery}>
                <Image
                  style={{ width: metrics.hp14, height: metrics.hp7 }}
                  resizeMode="contain"
                  source={Images.editFrame}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: scale(10) }}>
            <InputField
  label="Full Name"
  placeholder="Enter Full Name"
  value={name}
  error={errors.name}
  onChangeText={setName}
/>

              <InputField
                label="Mobile Number"
                placeholder="Enter your Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                error={errors.mobileNumber}
              />
              <InputField
                label="Email Address"
                placeholder="Enter your Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
              />
              <InputField
                label="Age"
                placeholder="Enter your Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                error={errors.age}
              />
              <InputField
                label="Pregnancy Month"
                placeholder="Enter Pregnancy Month"
                value={pregnancyMonth}
                onChangeText={setPregnancyMonth}
                keyboardType="numeric"
                error={errors.pregnancyMonth}
              />
            </View>

            <TouchableOpacity onPress={handleSave}>
              <LinearGradient
                colors={[AllColors.skyblue, AllColors.skyblue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}>
                {loading ? (
                  <ActivityIndicator size="small" color={AllColors.black} />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
