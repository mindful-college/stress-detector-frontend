import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/colors';

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.icon}>
        <Image style={styles.icon} source={require(`../images/left_arrow.png`)} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGrey,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10,
    color: Colors.header_black,
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: 15,
  },
});

export default ModalHeader;