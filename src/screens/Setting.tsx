import React from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';

export default function Setting() {
  const { dispatch } = useUserContext();

  const handleSignOut = () => {
    AsyncStorage.removeItem('user');
    dispatch({ type: 'REMOVE_USER' });
  };

  return (
    <View>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
