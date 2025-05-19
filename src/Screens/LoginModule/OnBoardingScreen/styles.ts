import {Dimensions, Platform, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import {Fonts} from '../../../Constants/Fonts';

const width = Dimensions.get('window').width;

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  touchView: {
    width: '80%',
    height: metrics.hp5_5,
    borderRadius: metrics.hp1_5,
    marginTop: metrics.hp3,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#5B98E8',
  },
  buttonInsideText: {
    fontSize: 16,
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.white,
    fontWeight: '900',
  },
});
