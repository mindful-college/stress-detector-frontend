import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../utils/colors';
import axios from 'axios';
import { DELETE_ACCOUNT_URL } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useUserContext } from '../context/UserContext';
import CustomLink from './CustomLink';

type DeleteAccountModalProps = {
  isVisible: boolean;
  onClose: () => void;
  userToken: string;
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onClose,
  isVisible,
  userToken,
}) => {
  //
  const { state, dispatch } = useUserContext();
  // console.log('Current user state in DeleteAccountModal:', state.user);

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(DELETE_ACCOUNT_URL, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        await AsyncStorage.removeItem('user');

        // dispatch({ type: 'REMOVE_USER' });
        // console.log('User state after dispatching REMOVE_USER:', state.user);
      }

      return response.data;
    } catch (error) {
      console.error('Error deleting the user information:', error);
      throw error;
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      console.log('Account deleted successfully');

      // AsyncStorage.removeItem('user');
      // console.log('User removed from AsyncStorage');

      // console.log('Dispatching REMOVE_USER action');
      // dispatch({ type: 'REMOVE_USER' });
      // console.log('REMOVE_USER action dispatched');

      Toast.show({
        type: 'success',
        text1: 'Your account has been deleted.',
      });

      onClose();
    },
    onError: (error) => {
      console.error('Error deleting account: ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete the account.',
      });
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose}>
            <Image style={styles.icon} source={require(`../images/x.png`)} />
          </TouchableOpacity>

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
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
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
  icon: {
    marginLeft: 200,
    width: 20,
    height: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: Colors.primary,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: Colors.white,
  },
});

export default DeleteAccountModal;
