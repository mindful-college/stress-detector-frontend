import React, { useReducer } from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialUser, userReducer } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';

export default function Setting() {
  const [state, dispatch] = useReducer(userReducer, initialUser);

  const handleSignOut = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };
    const res = await axios.post(SING_OUT_URL, { headers });
    AsyncStorage.removeItem('user');
    dispatch({ type: 'REMOVE_USER' });
  };

  return (
    <View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
