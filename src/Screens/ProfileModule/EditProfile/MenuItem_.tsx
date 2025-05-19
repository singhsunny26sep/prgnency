import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Animated from 'react-native-reanimated';
import {styles} from './style';
import {Images} from '../../../Assets/Images';
import {AllColors} from '../../../Constants/COLORS';

type MenuItemProps = {
  title: string;
  subtitle?: string;
  iconName: any;
  onPress: () => void;
};

const MenuItem_: React.FC<MenuItemProps> = ({
  title,
  subtitle,
  iconName,
  onPress,
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.iconAndText}>
          {/* Animated Icon */}
          <Animated.View style={styles.iconWrapper}>
            <Image style={styles.icon} resizeMode="contain" source={iconName} />
          </Animated.View>

          {/* Text Section */}
          <View>
            <Text
              style={[
                styles.menuTitle,
                {
                  color:
                    title == 'Logout Account' ? AllColors.red : AllColors.black,
                },
              ]}>
              {title}
            </Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          </View>
        </View>

        {/* Right Arrow */}
        <Animated.View style={{top: 5, overflow: 'hidden'}}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={Images.rightArrow}
            tintColor={title == 'Logout Account' ? AllColors.red : '#000'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItem_;
