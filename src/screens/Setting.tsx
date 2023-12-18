import React from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function Setting() {
  const { state, dispatch } = useUserContext();

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

  return (
    <View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
