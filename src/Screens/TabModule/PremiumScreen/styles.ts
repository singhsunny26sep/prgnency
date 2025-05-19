import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import { moderateScale, scale } from '../../../Constants/Scalling';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
  },
  container1: {
    marginTop:2
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  featuresContainer: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: scale(0),
  
  },
  featureSection: {
  },
  categoryTitle: {
    fontSize: fontSize(15),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp2,
    shadowColor: '#000', // iOS
    shadowOffset: {width: 0, height: 2}, // iOS
    shadowOpacity: 0.2, // iOS
    shadowRadius: 4, // iOS,
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25
  },
  topHeaderView: {
    height: metrics.hp30,
    justifyContent: 'center',
    backgroundColor: AllColors.skyblue,
  },
  bottomHeaderView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: AllColors.white,
    borderTopEndRadius: metrics.hp5,
    borderTopStartRadius: metrics.hp5,
  },
  subTexts: {
    textAlign: 'left',
    fontSize: fontSize(12),
    color: AllColors.black,
    lineHeight: 22,
    fontFamily:Fonts.AfacadMedium
  },
  ItemOfFetures: {
    marginHorizontal: metrics.hp2,
    justifyContent: 'flex-start',

    flexDirection: 'row',
  },
  headerContainer: {
    marginVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 14,
  },
  primaryColor: {
    backgroundColor: AllColors.primary100,
    height: metrics.hp18,
    width: metrics.hp14,
    top: -metrics.hp8,
    borderRadius: metrics.hp2,
  },
  lightGreenView: {
    backgroundColor: AllColors.lightGreen,
    height: metrics.hp18,
    width: metrics.hp14,
    top: -metrics.hp8,
    borderRadius: metrics.hp2,
  },
  lightPurpleView: {
    backgroundColor: AllColors.lightPurple,
    height: metrics.hp18,
    width: metrics.hp14,
    top: -metrics.hp8,
    borderRadius: metrics.hp2,
  },
  flexRowView: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: metrics.hp2,
  },
  InvestText: {
    textAlign: 'center',
    fontSize: fontSize(16),
   fontFamily:Fonts.AfacadMedium,
    color: AllColors.black,
  },
  yourChildText: {
    fontFamily:Fonts.AfacadBold,
     fontSize: fontSize(20),
    textAlign: 'center',
    color: AllColors.black,
  },
  silverText: {
    textAlign: 'center',
    fontSize: fontSize(15),
    fontFamily:Fonts.AfacadBold,
    top: metrics.hp1,
  },
  offView: {
    borderWidth: 1,
    borderRadius: metrics.hp1,
    justifyContent: 'center',
    marginTop: 12,
    width: metrics.hp9,
    alignSelf: 'center',
    zIndex: 10,
  },
  whiteBGView: {
    backgroundColor: 'white',
    height: metrics.hp12 + 2,
    marginHorizontal: 2,
    borderRadius: metrics.hp1_7,
    top: metrics.hp5_5,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  lineAmount: {
    top: 11,
    fontSize: fontSize(12),
    fontFamily: Fonts.AfacadBold,
    textDecorationLine: 'line-through',
  },
  Btncontainer:{
    backgroundColor: AllColors.skyblue,
    width: '90%',
    alignSelf: 'center',
    height: metrics.hp6,
    bottom: scale(150),
    borderRadius: metrics.hp1,
  },
  card: {
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: fontSize(14),
    color: AllColors.appDarkBackGround,
    flex: 1,
    fontFamily: Fonts.AfacadMedium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: fontSize(13),
    marginLeft: scale(5),
    fontFamily: Fonts.AfacadMedium,
  },
  feautureMaincard:{
    marginHorizontal:scale(15),
    marginBottom:scale(110),
    bottom:scale(50),
    backgroundColor:AllColors.white,
    borderWidth:0.5,
    padding:scale(10),
    borderRadius:moderateScale(8)
  },
  titletxt:{
    textAlign:"center",
    fontFamily:Fonts.AfacadBold,
    fontSize:moderateScale(20),
    marginBottom:scale(5)
  }
});
