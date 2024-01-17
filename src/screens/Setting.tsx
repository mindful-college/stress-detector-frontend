import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import Permission from '../coponents/Permission';
import Account from '../coponents/Account';
import { useMutation } from '@tanstack/react-query';
import ContactUsModal from '../coponents/ContactUsModal';
import CustomButton from '../coponents/CustomButton';
import { deleteAccount } from '../utils/userService';

type SupportListProps = {
  item: string;
  checkSupportType: (item: string) => JSX.Element | null;
};

const HelpSupportLists: React.FC<SupportListProps> = ({ item, checkSupportType }) => (
  <View style={styles.block}>
    <Text style={styles.item}>{item}</Text>
    {checkSupportType(item)}
  </View>
);

export default function Setting() {
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

  const handleOpenModal = (modalType: string) => {
    switch (modalType) {
      case 'Contact Us':
        setContactModalVisible(true);
        break;
      case 'Terms of Use':
        setTermsOfUseModalVisible(true);
        break;
      case 'Privacy Policy':
        setPrivacyPolicyModalVisible(true);
        break;
    }
  };

  const handleCloseModal = (modalType: string) => {
    switch (modalType) {
      case 'Contact Us':
        setContactModalVisible(false);
        break;
      case 'Terms of Use':
        setTermsOfUseModalVisible(false);
        break;
      case 'Privacy Policy':
        setPrivacyPolicyModalVisible(false);
        break;
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteAccount(userToken),
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

  const checkSupportType = (name: string): JSX.Element | null => {
    if (name === 'Contact Us') {
      return (
        <>
          <ContactUsModal
            isVisible={isContactModalVisible}
            onClose={() => handleCloseModal(name)}
            userToken={userToken}
            userEmail={userEmail}
          />
          <CustomButton
            title="SEND"
            onPress={() => handleOpenModal(name)}
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
          onPress={() => handleOpenModal(name)}
          textStyle={styles.buttonTextForModal}
          style={styles.touchableOpacityForModal}
          color={Colors.primary}
        />
      );
    } else if (name === 'Privacy Policy') {
      return (
        <CustomButton
          title="GO"
          onPress={() => handleOpenModal(name)}
          textStyle={styles.buttonTextForModal}
          style={styles.touchableOpacityForModal}
          color={Colors.primary}
        />
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Account />
      <Permission />

      <View>
        <Text style={styles.title} />
        {support.map((item) => (
          <HelpSupportLists item={item} key={item} checkSupportType={checkSupportType} />
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
    // backgroundColor:Colors.grey,
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
