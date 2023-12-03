import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CustomButtonProps = {
  title: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
};

const CustomButton = ({
  title,
  color,
  backgroundColor,
  onPress,
  disabled = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}>
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
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
