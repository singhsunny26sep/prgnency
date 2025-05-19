import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import { AllColors } from '../../Constants/COLORS';
import { moderateScale,scale,verticalScale } from '../../Constants/Scalling';
import { Fonts } from '../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Entypo';

const ElementDropdown = ({
  data,
  value,
  onChange,
  placeholder = 'Select item',
  ...props
}) => {
  const renderItem = (item: { code: string; name: string }) => ({
    label: item.name,  // Use the `name` property for displaying
    value: item.code,  // Use the `code` property for the value
  });

  const formattedData = data.map(renderItem);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.containerStyle}
      itemTextStyle={styles.itemTextStyle}
      data={formattedData}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={(item) => onChange(item.value)} 
      renderRightIcon={() => (
        <Icon name="chevron-small-down" size={35} color={AllColors.black} />
      )}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: verticalScale(45),
    backgroundColor: AllColors.white,
    borderRadius: scale(8),
    borderWidth: 0.5,
    borderColor: AllColors.lightGray,
    paddingHorizontal: scale(15),
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.gray4,
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.gray4,
  },
  containerStyle: {
    borderRadius: scale(8),
    borderWidth: 0.5,
    borderColor: AllColors.babyPink,
  },
  itemTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.AfacadRegular,
    color:AllColors.black,
  },
});

export default ElementDropdown;
