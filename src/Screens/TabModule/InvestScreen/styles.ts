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
});
