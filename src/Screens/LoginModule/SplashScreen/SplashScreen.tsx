// import {CommonActions, NavigationProp} from '@react-navigation/native';
// import React, {useState} from 'react';
// import {Image, ImageBackground, View} from 'react-native';
// import {Images} from '../../../Assets/Images';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {styles} from './styles';
// import { Container } from '../../../Components/Container/Container';
// import { AllColors } from '../../../Constants/COLORS';

// interface SplashScreenProps {
//   // route: { params: { changeSignInStatus: (flag: boolean) => void } }
//   navigation: NavigationProp<any, any>;
// }

// const SplashScreen = (props: SplashScreenProps) => {
//   React.useEffect(() => {
//     const storage = new MMKV();
//     if (storage.getString('number')) {
//       setTimeout(
//         () =>
//           props.navigation.dispatch(
//             CommonActions.reset({
//               index: 3,
//               routes: [{name: 'TabNavigator'}],
//             }),
//           ),
//         3000,
//       );
//     } else {
//       setTimeout(() => props.navigation.navigate('OnBoardingScreen'), 3000);
//     }
//     // }
//   }, []);

//   return (
//     <Container 
//      statusBarStyle={'dark-content'}
//      statusBarBackgroundColor={AllColors.white}
//      backgroundColor={AllColors.white}>
//         <Image
//           style={styles.SplashScreen}
//           source={Images.Applogo}
//           resizeMode="contain"
//         />
//     </Container>
      
//   );
// };

// export default SplashScreen;



import { CommonActions, NavigationProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Images } from '../../../Assets/Images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { MMKV } from 'react-native-mmkv';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface SplashScreenProps {
  navigation: NavigationProp<any, any>;
}

const SplashScreen = (props: SplashScreenProps) => {
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken'); 
        console.log('Token:', userToken);

        setTimeout(() => {
          if (userToken) {
            props.navigation.replace('TabNavigator'); 
          } else {
            props.navigation.replace('OnBoardingScreen'); 
          }
        }, 1000); 

      } catch (error) {
        console.error('Error checking auth status:', error);
        props.navigation.replace('OnBoardingScreen'); 
      }
    };

    checkUserAuth();
  }, [props.navigation]); 

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <Image
        style={styles.SplashScreen}
        source={Images.Applogo}
        resizeMode="contain"
      />
    </Container>
  );
};

export default SplashScreen;
