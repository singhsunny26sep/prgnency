import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Animated from 'react-native-reanimated';
import {Images} from '../../Assets/Images';
import {styles} from './style';
type MenuItemProps = {
  title: string;
  subtitle?: string;
  iconName: any;
  onPress: () => void;
};

const VideoItem: React.FC<MenuItemProps> = ({
  title,
  subtitle,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconAndText}>
        {/* Animated Icon */}
        <View style={styles.iconWrapper}>
          <Image style={styles.icons} resizeMode="contain" source={iconName} />
        </View>

        {/* Text Section */}
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {<Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Right Arrow */}
      <View style={{top: 5, overflow: 'hidden'}}>
        <Image
          style={styles.icon}
          resizeMode="contain"
          source={Images.rightArrow}
          tintColor={'#000'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default VideoItem;
