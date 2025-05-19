import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  StyleSheet
} from 'react-native';
import { Images } from '../../../Assets/Images';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts, fontSize } from '../../../Constants/Fonts';
import strings from '../../../../localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { actionTypes } from '../../../Redux/ActionTypes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { moderateScale, scale, verticalScale } from '../../../Constants/Scalling';
import { LanguageData } from '../../../Utils/DataBase';
import RadioBtn from '../../../Components/radioButton/RadioButton';

const LanguageScreen = (props) => {
  const [language, setLanguage] = useState('');
  const languages = useSelector((state) => state.Common.language);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  console.log(',.....', languages);
  
  const changeLanguage = async (lang) => {
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

  const renderLanguageItem = ({ item }) => {
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
    <View style={styles.container}>
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
          <Text style={[styles.silverText]}>{strings.chooseLanguage}</Text>
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

export default LanguageScreen;

const styles = StyleSheet.create({
  logoImage: {
    width: '100%',
    height: metrics.hp20,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp2,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    elevation: 22, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.2, // iOS
    shadowRadius: 4, // iOS
  },
  section: {
    marginVertical: 10,
    marginHorizontal: metrics.hp1,
  },
  topHeaderView: {
    height: metrics.hp20,
    justifyContent: 'center',
    backgroundColor: AllColors.white,
  },
  InvestText: {
    textAlign: 'center',
    fontSize: fontSize(16),
    fontWeight: '400',
    color: AllColors.black,
  },
  yourChildText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: fontSize(20),
    textAlign: 'center',
    color: AllColors.black,
    marginHorizontal: scale(50)
  },
  silverText: {
    fontSize: fontSize(15),
    fontFamily: Fonts.AfacadBold,
    left: metrics.hp2,
  },
  shadowView: {
    backgroundColor: AllColors.white,
    width: '90%',
    alignSelf: 'center',
    height: metrics.hp6,
    borderRadius: metrics.hp1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: AllColors.white,
    width: '100%',
    height: "50%",
    borderTopLeftRadius: metrics.hp2,
    borderTopRightRadius: metrics.hp2,
    paddingBottom: scale(5),
  },
  ModalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    marginVertical: verticalScale(5),
    borderBottomWidth: 1,
    borderBottomColor: AllColors.primary
  },
  MHeadrTxt: {
    fontFamily: Fonts.AfacadBold,
    fontSize: moderateScale(16)
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: AllColors.lightGray,
    paddingHorizontal: scale(15)
  },
  languageText: {
    fontSize: fontSize(16),
    color: AllColors.black,
    fontFamily: Fonts.AfacadMedium
  },
});
