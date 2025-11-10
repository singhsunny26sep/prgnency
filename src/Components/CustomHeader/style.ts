import {StyleSheet} from 'react-native';
import metrics from '../../Constants/Metrics';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {AllColors} from '../../Constants/COLORS';
import { scale } from '../../Constants/Scalling';
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 0,
    marginRight: 0,
    marginTop: metrics.hp0_5,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchImage: {
    width: scale(28),
    height: scale(28),
    right:scale(10)
  },
  notificationImage: {
    width: metrics.hp3,
    height: metrics.hp3,
    borderRadius: metrics.hp2_5,
  },
  touchBack: {
    height: metrics.hp4_5,
    width: metrics.hp5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.hp1,
  },
  touchDots: {
    height: metrics.hp4,
    width: metrics.hp1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.hp1,
    alignSelf: 'center',
  },
  backWithMenu: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',

    paddingLeft: metrics.hp1,
  },
  screenText: {
    fontSize: fontSize(16),
    color: AllColors.black,
    marginLeft: metrics.hp1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    fontFamily: Fonts.AfacadSemibold,
    textAlign: 'center',
    left: metrics.hp2,
  },
  screenT: {
    fontSize: fontSize(20),
    color: AllColors.black,
    top: metrics.hp0_5,
    right: metrics.hp1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontFamily:Fonts.AfacadBold,
    textAlign: 'center',
  },
  bacgroundImage: {
    width: metrics.hp6,
    height: metrics.hp6,
    borderRadius: metrics.hp3,
    alignSelf: 'center',
  },
  investHeaderView: {
    height: metrics.hp7,
    width: '105%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  investSubHeader: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: metrics.hp6,
    height: metrics.hp6,
    borderRadius: metrics.hp3,
    alignItems: 'center',
  },
  userFonts: {
    fontFamily: Fonts.AfacadBold,
    fontSize: fontSize(14),
    color: AllColors.black,
  },
  userSubFont: {
    fontFamily: Fonts.AfacadMedium,
    fontSize: fontSize(12),
    color: AllColors.black,
  },
  searchMainView: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: scale(15),
  },
  iconButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
