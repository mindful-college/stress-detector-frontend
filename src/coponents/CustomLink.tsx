import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type CustomButtonProps = {
  handleNavigate: () => void;
  text: string;
  color?: string;
};

const CustomLink = ({ handleNavigate, text, color }: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={handleNavigate}>
      <Text style={[styles.link, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    fontSize: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
});

export default CustomLink;
