import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import metrics from '../../../Constants/Metrics';
import { verticalScale } from '../../../Constants/Scalling';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  container: {
    marginTop: metrics.hp1,
    flex: 1,
  },
  container_: {
    height: '100%',
    width: '90%',
    marginTop: metrics.hp2,
    alignSelf: 'center',
    backgroundColor: AllColors.white,
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
  eaderView: {
    flexDirection: 'row',
    height: metrics.hp12,
    backgroundColor: AllColors.babyPink,
    paddingTop: metrics.hp2,
    borderBottomEndRadius: metrics.hp20,
    borderTopStartRadius: metrics.hp20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 20,
    color: '#FFF',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  sepratorSection: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal:16
  },
  profileBackground: {
    width: '100%',
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: fontSize(15),
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
  contact: {
    fontSize: fontSize(12),
    color: AllColors.black,
    top: 1,
    marginVertical:verticalScale(0),
    fontFamily: Fonts.AfacadRegular,
  },
  email: {
    fontSize: fontSize(12),
    color: AllColors.black,
    fontFamily: Fonts.AfacadRegular,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row', // Ensures icon and text align horizontally
    alignItems: 'center',
  },
  editContent: {
    flexDirection: 'row', // Align icon and text in a horizontal line
    alignItems: 'center', // Center align vertically
  },
  editIconWrapper: {
    marginRight: 6, // Spacing between icon and text
  },
  editIcon: {
    width: 12, // Icon width
    height: 12, // Icon height
  },
  editText: {
    fontSize: 12,
    color: AllColors.white,
    fontFamily:Fonts.AfacadBold,
  },

  section: {
    marginVertical: 10,
  },
  menuItem: {
    flex: 1,
    margin: 5,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AllColors.lightBlue,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 11,
    elevation: 11, // For Android
  },
  iconAndText: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily:Fonts.AfacadBold,
    top: metrics.hp1,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    fontFamily:Fonts.AfacadBold,
  },
  
  arrow: {
    fontSize: 18,
    color: AllColors.white,
    fontFamily:Fonts.AfacadBold,

  },
});
