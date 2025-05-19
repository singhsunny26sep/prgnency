import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts} from '../../../Constants/Fonts';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
  },
  logoImage: {
    width: '100%',
    height: metrics.hp13,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  phoneText: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 24,
    textAlign: 'center',
    color: AllColors.black,
    fontWeight: '700',
    marginTop: metrics.hp3,
  },
  phoneSubText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 14,
    textAlign: 'center',
    color: AllColors.subText,
    marginTop: metrics.hp1,
  },
  countryCode: {
    height: metrics.hp6,
    width: '18%',
    backgroundColor: AllColors.white,
    borderWidth: 1,
    borderColor: AllColors.subText,
    borderRadius: metrics.hp1,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    color: AllColors.black,
    paddingVertical: 17,
    fontFamily: Fonts.AfacadMedium,
  },
  phoneNumberText: {
    fontFamily: Fonts.AfacadRegular,
    fontSize: 18,
    color: AllColors.black,
    marginTop: metrics.hp5,
  },
  textInputView: {
    height: metrics.hp6,
    width: '80%',
    backgroundColor: AllColors.white,
    borderWidth: 1,
    borderColor: AllColors.subText,
    borderRadius: metrics.hp1,
    left: 5,
    paddingLeft: 11,
    fontSize: 14,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
  InputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: metrics.hp2,

    marginRight: 5,
  },
  TermsView: {
    flexDirection: 'row',
    marginTop: metrics.hp2,
    flex: 1,
    marginRight: 5,
  },
  marginView: {
    marginHorizontal: metrics.hp2,
    marginBottom: Platform.OS == 'android' ? 0 : 150,
    flex: 1,
  },
  Privacy: {
    color: AllColors.subText,
    textDecorationLine: 'underline',
    fontFamily: Fonts.AfacadRegular,
    fontSize: 15,
  },
  checkImage: {
    height: metrics.hp2_22,
    width: metrics.hp2_22,
  },
  commonText: {
    color: AllColors.subText,
    fontFamily: Fonts.AfacadRegular,
    fontSize: 15,
  },
  buttonView: {
    width: '100%',
    height: metrics.hp6,

    borderRadius: metrics.hp1,
    marginTop: metrics.hp3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInsideText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.white,
  },
});
