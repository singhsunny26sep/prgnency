import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import metrics from '../../Constants/Metrics';
import {Fonts} from '../../Constants/Fonts';

export const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AllColors.white,
    padding: 9,
    borderWidth: 1,
    width: '90%',
    height: metrics.hp11,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: metrics.hp2,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: metrics.hp0_5,
    backgroundColor: AllColors.lightGray,
  },
  icon: {
    width: 40,
    height: 40,
    top: -metrics.hp0_5,
    alignSelf: 'center',
    color: AllColors.subText, // Adjust to fit your layout
  },
  icons: {
    width: 110,
    height: 65, // Adjust to fit your layout
  },
  menuTitle: {
    fontSize: 16,
    color: AllColors.black,
    fontWeight: 300,
    fontFamily: Fonts.AfacadBold,
  },
  menuSubtitle: {
    fontSize: 14,
    color: AllColors.subText,
    fontFamily: Fonts.AfacadRegular,
  },
  arrow: {
    fontSize: 18,
    color: AllColors.white,
  },
});
