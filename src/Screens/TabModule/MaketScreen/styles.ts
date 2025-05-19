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
  container_: {
    height: '100%',
    width: '90%',
    marginTop: metrics.hp2,
    alignSelf: 'center',
    backgroundColor: AllColors.white,
  },
  logoImage: {
    width: '100%',
    height: metrics.hp20,
    marginTop: Platform.OS == 'android' ? metrics.hp9 : metrics.hp3,
  },
  section: {
    marginVertical: 10,
    marginHorizontal: metrics.hp1,
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
    fontFamily:Fonts.AfacadMedium,
    top: metrics.hp1,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});
