import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../utils/colors';

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.icon}>
          <Image style={styles.icon} source={require(`../images/left_arrow.png`)} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    zIndex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGrey,
  },
  headerText: {
    fontSize: 17,
    fontWeight: windowWidth < 350 ? '500' : '600',
    marginTop: 10,
    color: Colors.header_black,
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: 5,
  },
});

export default ModalHeader;
