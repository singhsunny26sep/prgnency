import {Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import {Fonts} from '../../../Constants/Fonts';
import metrics from '../../../Constants/Metrics';
import { scale } from '../../../Constants/Scalling';

export const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
  },
  marginView: {
    marginBottom: Platform.OS == 'android' ? 0 : 0,
    height: '100%',
    width: '100%',
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
  container: {
    flex: 1,
    backgroundColor: AllColors.appDarkBackGround,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: metrics.hp3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AllColors.white,
  },
  editPhotoButton: {
    marginTop: metrics.hp1,
  },
  editPhotoText: {
    color: AllColors.white,
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 8,
    height: metrics.hp6,
    justifyContent: 'center',
    marginHorizontal:scale(18),
    marginTop: 20, // Adds spacing above the button
  },
  saveButtonText: {
    color: AllColors.black,
    fontSize: 18,
    fontWeight: 'semibold',
    textAlign: 'center',
    fontFamily: Fonts.AfacadBold,
  },
  section: {
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AllColors.white,
    padding: 9,
    borderRadius: 20,
    height: metrics.hp7,
    width: '50%',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 20,
    height: metrics.hp4,
    width: metrics.hp4,
    justifyContent: 'center',
    borderRadius: metrics.hp0_5,
  },
  icon: {
    width: 40,
    height: 40,
    padding: metrics.hp1,
    alignSelf: 'center',
    color: AllColors.subText, // Adjust to fit your layout
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
