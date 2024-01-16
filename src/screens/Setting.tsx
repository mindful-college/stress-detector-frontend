import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import CustomLink from '../coponents/CustomLink';
import Permission from '../coponents/Permission';
import Account from '../coponents/Account';
import { useMutation } from '@tanstack/react-query';
import { DELETE_ACCOUNT_URL } from '../utils/api';

export default function Setting({ navigation }) {
  const { state, dispatch } = useUserContext();
  const [support, setSupport] = useState(['Contact Us', 'Terms of Use', 'Privacy Policy']);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isTermsOfUseModalVisible, setTermsOfUseModalVisible] = useState(false);
  const [isPrivacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false);
  const userToken = state.user?.access_token;
  const userEmail = state.user?.email;

  const handleSignOut = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user?.access_token}`,
      };
      const { status } = await axios.post(SING_OUT_URL, {}, { headers });
      if (status === 200) {
        AsyncStorage.removeItem('user');
        dispatch({ type: 'REMOVE_USER' });
        Toast.show({
          type: 'success',
          text1: 'See you agian!',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(DELETE_ACCOUNT_URL, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

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

      AsyncStorage.removeItem('user');
      dispatch({ type: 'REMOVE_USER' });

      Toast.show({
        type: 'success',
        text1: 'Your account has been deleted.',
      });
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

  const handleDeleteAccountWithConfirmation = () => {
    Alert.alert(
      'Confirm Account Deletion', // Title
      'Are you sure you want to delete your account? This action cannot be undone.', // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancellation of account deletion'),
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => handleDeleteAccount() },
      ],
      { cancelable: false },
    );
  };

  const goToContact = () => {
    navigation.navigate('CONTACTUS');
  };
  const goToPolicy = () => {
    navigation.navigate('POLICY');
  };
  const goToUse = () => {
    navigation.navigate('TERMSOFUSE');
  };

  const checkSupportType = (name) => {
    if (name === 'Contact Us') {
      return (
        <>
          <ContactUsModal
            isVisible={isContactModalVisible}
            onClose={() => handleCloseModal('Contact Us')}
            userToken={userToken}
            userEmail={userEmail}
          />
          <CustomButton
            title="SEND"
            onPress={() => handleOpenModal('Contact Us')}
            textStyle={styles.buttonTextForModal}
            style={styles.touchableOpacityForModal}
            color={Colors.primary}
          />
        </>
      );
    } else if (name === 'Terms of Use') {
      return (
        <CustomButton
          title="GO"
          onPress={handleOpenModal}
          textStyle={styles.buttonTextForModal}
          style={styles.touchableOpacityForModal}
          color={Colors.primary}
        />
      );
    } else if (name === 'Privacy Policy') {
      return (
        <CustomButton
          title="GO"
          onPress={handleOpenModal}
          textStyle={styles.buttonTextForModal}
          style={styles.touchableOpacityForModal}
          color={Colors.primary}
        />
      );
    }
    return;
  };

  return (
    <ScrollView style={styles.container}>
      <Account />
      <Permission />

      <View>
        <Text style={styles.title} />
        {support.map((item) => (
          <DrawItemWithLink item={item} key={item} />
        ))}
      </View>

      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Delete Account" onPress={handleDeleteAccountWithConfirmation} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    borderTopColor: Colors.grey,
    borderTopWidth: 0.5,
    borderBottomColor: Colors.grey,
    borderBottomWidth: 0.5,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: Colors.black,
    paddingTop: 20,
    paddingBottom: 10,
    marginHorizontal: '5%',
  },
  item: {
    fontSize: 16,
    color: Colors.black,
    marginVertical: 5,
    marginLeft: 2,
  },
  button: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    fontSize: 16,
    color: Colors.black,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.primary,
  },
  touchableOpacityForModal: {
    padding: 0,
    marginVertical: 0,
  },
  buttonTextForModal: {
    fontWeight: '500',
  },
});
