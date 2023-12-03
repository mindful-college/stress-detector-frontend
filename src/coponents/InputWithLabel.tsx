import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

type InputWithLabelProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

const InputWithLabel = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputWithLabelProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderColor: Colors.grey,
    borderWidth: 1,
    padding: 8,
  },
});

export default InputWithLabel;
