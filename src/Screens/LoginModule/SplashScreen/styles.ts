import {Dimensions, StyleSheet} from 'react-native';
import {AllColors} from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: AllColors.white,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SplashScreen: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: metrics.hp4,
    height: '70%',
    width: '70%',
  },
});
