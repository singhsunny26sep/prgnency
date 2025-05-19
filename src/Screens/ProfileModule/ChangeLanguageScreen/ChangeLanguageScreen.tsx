import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList
} from 'react-native';
import {Images} from '../../../Assets/Images';
import {styles} from './styles';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import MenuItem from '../../ProfileModule/ProfileScreen/MenuItem';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';
import strings from '../../../../localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux';
import { actionTypes } from '../../../Redux/ActionTypes';
import ElementDropdown from '../../../Components/ElementDropdown/ElementDropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale, scale, verticalScale } from '../../../Constants/Scalling';
import { LanguageData } from '../../../Utils/DataBase';
import RadioBtn from '../../../Components/radioButton/RadioButton';


interface ChangeLanguageScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const ChangeLanguageScreen = (props: ChangeLanguageScreenProps) => {
  const [language, setLanguage] = useState('');
  const languages = useSelector((state: RootState) => state.Common.language);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  console.log(',.....', languages);
  
  const changeLanguage = async (lang: string) => {
    dispatch({ type: actionTypes.SET_LANGUAGE, payload: lang });
    await AsyncStorage.setItem('selectedLanguage', lang);  
    setModalVisible(false);
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        dispatch({ type: actionTypes.SET_LANGUAGE, payload: savedLanguage });
      }
    };
    loadLanguage();
  }, []);

  const renderLanguageItem = ({ item }: any) => {
    const isSelected = languages === item.code;
    return (
      <TouchableOpacity
        style={styles.languageOption}
        onPress={() => changeLanguage(item.code)} 
      >
        <Text style={styles.languageText}>{item.name}</Text>
        <RadioBtn checked={isSelected} onPress={() => changeLanguage(item.code)} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <View style={styles.headerView}>
        <CustomHeader
          type="back"
          screenName={strings.changeLanguage}  
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
      </View>
      <Image
        style={styles.logoImage}
        resizeMode="contain"
        source={Images.language}
      />
      <View style={styles.topHeaderView}>
        <Text style={styles.yourChildText}>{strings.chooseyourePreferred}</Text>
      </View>
      <TouchableOpacity style={[styles.shadowView,{flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal:scale(2)}]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.silverText,{}]}>{strings.chooseLanguage}</Text>
           <AntDesign name='caretdown' size={25} style={{marginRight:scale(8)}}/>
      </TouchableOpacity>
    
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} 
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
             <View style={styles.ModalHeaderContainer}>
                <Text style={styles.MHeadrTxt}>Select your language</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name='closecircleo' size={25}/>
              </TouchableOpacity>
             </View>
             <FlatList
              data={LanguageData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangeLanguageScreen;
