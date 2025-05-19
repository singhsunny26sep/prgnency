import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  TabActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {Images} from '../../Assets/Images';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {AllColors} from '../../Constants/COLORS';
import metrics from '../../Constants/Metrics';

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const navigationRef = useNavigation();
  const [isPress, setIsPress] = useState(false);

  const onPress = (route: string) => {
    const jumpToAction = TabActions.jumpTo(route, {});
    navigation.dispatch(jumpToAction);
  };

  const getIcon = (route: string, isFocused: boolean, index: number) => {
    return (
      <TouchableOpacity
        style={styles.touchTabBtn}
        onPress={() => onPress(route)}>
        {route === 'Premium' ? (
          isFocused ? (
            <Image source={Images.tabHomeFilled} style={styles.tabImage} />
          ) : (
            <Image source={Images.tabHome} style={styles.tabImage} />
          )
        ) : route === 'Store' ? (
          isFocused ? (
            <Image source={Images.portfolioFilled} style={styles.tabImage} />
          ) : (
            <Image source={Images.portfolio} style={styles.tabImage} />
          )
        ) : route === 'Home' ? (
          <View />
        ) : route === 'Support' ? (
          isFocused ? (
            <Image source={Images.investFilled} style={styles.tabImage} />
          ) : (
            <Image source={Images.invest} style={styles.tabImage} />
          )
        ) : isFocused ? (
          <Image source={Images.marketFilled} style={styles.tabImage} />
        ) : (
          <Image source={Images.market} style={styles.tabImage} />
        )}
        {route !== 'Home' ? (
          <Text
            style={[
              styles.tabBarLable,
              {
                fontSize: Platform.OS === 'ios' ? fontSize(8) : fontSize(10),
                fontFamily: isFocused
                  ? Fonts.AfacadSemibold
                  : Fonts.AfacadRegular,
                color: isFocused ? '#000' : '#8f8d97',
              },
            ]}>
            {route}
          </Text>
        ) : (
          <Text
            style={[
              styles.tabBarLable,
              {
                fontSize:
                  Platform.OS === 'android' ? fontSize(12) : fontSize(9),
                left: 0,
                top: metrics.hp1_72,
                fontFamily: Fonts.AfacadSemibold,
                color: isFocused ? AllColors.black : '#8f8d97',
              },
            ]}>
            {'Home'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subView}>
        <View style={styles.imageTabBg}>
          <View style={styles.viewRow}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              return (
                <View style={styles.tabBatButtonContainer} key={index}>
                  {getIcon(route.name, isFocused, index)}
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.MgpImageContainer}
            onPress={() => onPress('Home')}>
            <Image source={Images.tabMainIcon} style={styles.MgpImage} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomTabBar;
