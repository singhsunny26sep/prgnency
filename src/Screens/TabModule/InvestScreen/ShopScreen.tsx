import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {ImageBackground, SafeAreaView, View} from 'react-native';
import {Images} from '../../../Assets/Images';
import {styles} from './styles';
import {WebView} from 'react-native-webview';
import metrics from '../../../Constants/Metrics';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';

interface ShopScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const ShopScreen = (props: ShopScreenProps) => {
  return (
    <Container
     statusBarStyle={'dark-content'}
     statusBarBackgroundColor={AllColors.white}
     backgroundColor={AllColors.white}>
      <WebView
        source={{uri: 'https://store.dreamchild.in/'}}
        style={{flex: 1, marginBottom: metrics.hp11}}
      />
    </Container>
  );
};

export default ShopScreen;
