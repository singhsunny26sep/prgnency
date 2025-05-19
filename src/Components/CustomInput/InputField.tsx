import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {AllColors} from '../../Constants/COLORS';
import metrics from '../../Constants/Metrics';
import {Fonts} from '../../Constants/Fonts';

interface InputFieldProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.errorInput : null]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: AllColors.black,
    fontSize: 16,
    marginBottom: 6,
    marginLeft: metrics.hp1,
    fontFamily: Fonts.AfacadBold,
  },
  input: {
    backgroundColor: AllColors.white,
    borderRadius: metrics.hp1,
    fontSize: 14,
    color: AllColors.black,
    borderWidth: 1,
    height: metrics.hp5,
    paddingLeft: metrics.hp2,
    marginHorizontal: metrics.hp1,
    fontFamily: Fonts.AfacadRegular,
  },
  errorInput: {
    borderColor: AllColors.red,
    borderWidth: 1,
  },
  errorText: {
    color: AllColors.red,
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
