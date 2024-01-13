import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

type DeleteAccountModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, isVisible }) => {
  const handleDeleteAccount = () => {
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text>Your account will be deleted</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleDeleteAccount();
            }}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 10,
    backgroundColor: Colors.primary,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: Colors.white,
  },
});

export default DeleteAccountModal;
