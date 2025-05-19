import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import metrics from '../../Constants/Metrics';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {FlatList} from 'react-native-gesture-handler';
import { moderateScale, scale, verticalScale } from '../../Constants/Scalling';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: AllColors.white,
  },
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp1,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    elevation: 22, // Android
    shadowColor: '#000', // iOS
    shadowOffset: {width: 0, height: 2}, // iOS
    shadowOpacity: 0.2, // iOS
    shadowRadius: 4, // iOS
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  portFolioImage: {
    width: Dimensions.get('screen').width - 20,
    height: metrics.hp25 + metrics.hp2,
    marginVertical: metrics.hp3,
    alignSelf: 'center',
  },
  viewTopBar: {
    height: metrics.hp6,
    width: '100%',
  },
  FlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: metrics.hp3,
  },
  commonChangableView: {
    flex: 1,
    marginTop: metrics.hp2,
    marginHorizontal: metrics.hp1,
  },
  commonText: {
    color: AllColors.white,
    fontFamily: Fonts.AfacadSemibold,
    fontSize: fontSize(14),
  },
  flatListContainer: {
    paddingHorizontal:scale(6),
    marginTop: metrics.hp2,
  },
  card: {
    width:scale(85), 
    height: scale(85),
    marginRight:scale(8), 
    borderRadius:moderateScale(8),
    backgroundColor: AllColors.white,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:AllColors.primary
  },
  cardImage: {
    width:scale(50), 
    height: scale(50),
    marginBottom:scale(5)
  },
  cardTitle: {
    fontSize:moderateScale(12), 
    fontFamily:Fonts.AfacadBold,
    textAlign: 'center',
    marginBottom:scale(5),
    color:AllColors.babyPink
  },
  Card2Container:{
    backgroundColor: AllColors.white,
    marginVertical: scale(5),
    marginHorizontal: scale(15),
    borderRadius: scale(5),
    elevation: 4, 
    shadowColor: AllColors.black, 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: scale(4),
    overflow: 'hidden',
  },
  Card2SecondContainer:{
    flexDirection: 'row',
    padding: scale(15),
  },
  card2Image:{
    height: scale(105),
    width: scale(105),
    borderRadius: scale(5),
    marginRight: scale(10),
    borderWidth: 0.5,
    borderColor: AllColors.primary,
  },
  Card2text:{
    fontSize: scale(16),
    fontFamily:Fonts.AfacadBold,
    color: AllColors.babyPink,
    marginBottom: scale(5),
  },
  card2secondtxt:{
    fontSize: scale(14),
    color: AllColors.HistoryColor,
    fontFamily:Fonts.AfacadMedium,
  },
  TextContainers: {
    marginHorizontal: scale(15),
    marginVertical: verticalScale(10),
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  textContainerLeft: {
    flex: 1, 
  },
  textContainerRight: {
    alignItems: 'center',
    backgroundColor: '#00D100', 
    paddingVertical:verticalScale(3),
    borderRadius: 5,
    height:scale(50),
    width:scale(58),
  },
  
  Titletxtt: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadBold,
  },
  
  title2textt: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.AfacadRegular,
    marginTop: verticalScale(5),
  },
  readMoreText: {
    position: 'absolute',
    bottom: 10, 
    right: 10, 
    fontSize: moderateScale(15), 
    color: AllColors.backgroundColor, 
    fontFamily:Fonts.AfacadBold, 
    paddingHorizontal: 5, 
  },
  WhatsAppImg:{
    height:scale(100),
    width:scale(320),
    borderRadius:moderateScale(5),
    marginTop:scale(5)
  }
});
