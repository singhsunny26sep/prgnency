import {StyleSheet, Dimensions} from 'react-native';
import {Fonts, fontSize} from '../../../Constants/Fonts';
import metrics from '../../../Constants/Metrics';
import {AllColors} from '../../../Constants/COLORS';
import { scale } from '../../../Constants/Scalling';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.skyblue,
  },

  subcontainer: {
    height: '50%',
    width: '100%',
    marginTop: metrics.hp5,
    borderTopEndRadius: metrics.hp10 + metrics.hp2,
    borderTopStartRadius: metrics.hp10 + metrics.hp2,
    backgroundColor: AllColors.white,
  },

  slide: {
    flex: 1,
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: scale(250),
    height: scale(250),
    marginBottom: 100,
  },
  title: {
    fontSize: fontSize(28),
    fontFamily: Fonts.AfacadBold,
    color: '#333',
    textAlign: 'center',
    marginBottom:scale(100),
  },
  text: {
    fontSize: fontSize(18),
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 100,
    fontFamily:Fonts.AfacadMedium
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.wp25,
    paddingVertical: metrics.hp2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nextButton: {
    backgroundColor: AllColors.primary,
    paddingVertical: metrics.hp2,
    paddingHorizontal: metrics.wp25,
    borderRadius: metrics.hp2,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: metrics.hp2,
    paddingHorizontal: metrics.wp25,
    borderRadius: metrics.hp2,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AllColors.white,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AllColors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A6D1E6',
  },
});
