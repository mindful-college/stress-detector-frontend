import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../utils/colors';

type CustomButtonProps = {
  title: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const CustomButton = ({
  title,
  color,
  backgroundColor,
  onPress,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? Colors.lightGrey : backgroundColor },
        style,
      ]}
      onPress={onPress}>
      <Text style={[styles.buttonText, { color }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default CustomButton;
