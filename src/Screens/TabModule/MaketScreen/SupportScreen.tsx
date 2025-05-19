import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {Images} from '../../../Assets/Images';
import {styles} from './styles';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import MenuItem from '../../ProfileModule/ProfileScreen/MenuItem';
import metrics from '../../../Constants/Metrics';
import {AllColors} from '../../../Constants/COLORS';
import MenuItem_ from '../../ProfileModule/EditProfile/MenuItem_';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import {useTranslation} from 'react-i18next';
import strings from '../../../../localization';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux';
import { Container } from '../../../Components/Container/Container';

interface SupportScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const SupportScreen = (props: SupportScreenProps) => {
  const {t, i18n} = useTranslation();

  const [currentLanguage, setLanguage] = useState('en');
  const language = useSelector((state: RootState) => state.Common.language);

  const changeLanguage = (value: any) => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch((err: any) => console.log(err));
  };
  const menuItems = [
    {
      title: strings.chatWithUs,
      iconName: Images.message,
      onPress: () => console.log('Price alert'),
    },
    {
      title: '+91 63 5656 3434',
      iconName: Images.call,
      onPress: () => Linking.openURL(`tel:${'+91 63 5656 3434'}`),
    },
    {
      title: 'www.test.com',
      iconName: Images.send,
      onPress: () => Linking.openURL(`https:${'www.test.com'}`),
    },
    {
      title: 'hello@gmail.com',
      iconName: Images.mail,
      onPress: () => Linking.openURL(`mailto:${'hello@gmail.com'}`),
    },
     {
      title: 'Frequently Asked Questions',
      iconName: Images.faq,
      onPress: (()=> props.navigation.navigate('FaqScreen')),
    },
  ];

  const renderItem = ({item}: any) => (
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
       <View style={styles.headerView}>
        <CustomHeader
          type="back"
          screenName={strings.support}
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>
      <Text
        style={{
          top: metrics.hp5,
          textAlign: 'center',
          fontSize: fontSize(18),
          fontFamily:Fonts.AfacadBold
        }}>{`${strings.Hi} Test ${strings.howCanHelp} `}</Text>

      <Image
        style={styles.logoImage}
        resizeMode="contain"
        source={Images.supportIcon}
      />
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.title}
        numColumns={2} 
        contentContainerStyle={[styles.container_]}
      />
    </Container>
  );
};

export default SupportScreen;
