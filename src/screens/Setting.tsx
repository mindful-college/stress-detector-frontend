import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import Permission from '../coponents/Permission';
import Account from '../coponents/Account';
import ContactUsModal from '../coponents/ContactUsModal';
import CustomButton from '../coponents/CustomButton';

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
          <HelpSupportLists item={item} key={item} checkSupportType={checkSupportType} />
        ))}
      </View>

      <Button title="Sign Out" onPress={handleSignOut} />
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
