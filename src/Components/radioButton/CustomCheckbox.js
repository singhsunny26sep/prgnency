import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 


const CustomCheckbox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
      <Icon
        name={checked ? 'check-box' : 'check-box-outline-blank'} 
        size={24} 
        color={checked ? '#0A3A67' : '#B0B0B0'} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, 
  },
});

export default CustomCheckbox;
