import {Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import {Fonts, fontSize} from '../../Constants/Fonts';
import metrics from '../../Constants/Metrics';
import { scale } from '../../Constants/Scalling';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 0,
    width: '100%',
    marginBottom: metrics.hp1,
    marginLeft: Platform.OS == 'android' ? 1 : 0,
  },
  tabBatButtonContainer: {
    width: '19%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  touchTabBtn: {
    alignItems: 'center',
    height: '100%',
    width: '90%',
    left: 5,
    marginBottom: metrics.hp1_7,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabBarLable: {fontSize: fontSize(10), fontFamily: Fonts.AfacadRegular},
  viewRow: {
    flexDirection: 'row',
    height: metrics.hp5 + metrics.hp0_5,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  viewShadow: {padding: 4, borderRadius: 30},
  MgpImageContainer: {
    borderRadius: metrics.hp4,
    bottom: metrics.hp2,
    position: 'absolute',
    alignSelf: 'center',
  },
  MgpImage: {height: metrics.hp10, width: metrics.hp10, right: metrics.hp0_6},
  tabImage: {height:scale(35), width: scale(35)},
  imageTabBg: {
    height: metrics.hp8,
    width: '95%',
    backgroundColor: AllColors.skyblue,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 7,
    left: '2%',
    right: 0,
    borderColor: AllColors.textInput,
    borderRadius: metrics.hp6,
  },
});
