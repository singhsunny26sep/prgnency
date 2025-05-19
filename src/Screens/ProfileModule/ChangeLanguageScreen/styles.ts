import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import { moderateScale, scale, verticalScale } from '../../../Constants/Scalling';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
  },

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
    shadowOffset: {width: 0, height: 2}, // iOS
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
    fontFamily:Fonts.AfacadBold,
    fontSize: fontSize(20),
    textAlign: 'center',
    color: AllColors.black,
    marginHorizontal:scale(50)
  },
  silverText: {
    fontSize: fontSize(15),
    fontFamily:Fonts.AfacadBold,
    left: metrics.hp2,
  },
  shadowView: {
    backgroundColor: AllColors.white,
    width: '90%',
    alignSelf: 'center',
    height: metrics.hp6,
    borderRadius: metrics.hp1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
   
    justifyContent: 'space-between',
    // Android shadow (elevation)
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
    height:"50%",
    borderTopLeftRadius: metrics.hp2,
    borderTopRightRadius: metrics.hp2,
    paddingBottom:scale(5),
  },
  ModalHeaderContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:verticalScale(10),
    paddingHorizontal:scale(15),
    marginVertical:verticalScale(5),
    borderBottomWidth:1,
    borderBottomColor:AllColors.primary
  },
  MHeadrTxt:{
    fontFamily:Fonts.AfacadBold,
    fontSize:moderateScale(16)
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: AllColors.lightGray,
    paddingHorizontal:scale(15)
  },
  languageText: {
    fontSize: fontSize(16),
    color: AllColors.black,
    fontFamily:Fonts.AfacadMedium
  },
});
