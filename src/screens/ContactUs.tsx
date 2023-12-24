import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useUserContext } from '../context/UserContext';

export default function Contactus({ navigation }) {
  const { dispatch } = useUserContext();
  const inputOption = ['Question', 'Bug Report', 'Suggestion', 'Compliment'];

  useEffect(() => {
    dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: false }); // Hide the tab bar

    return () => dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: true }); // Show on unmount
  }, [dispatch]);
  return (
    <View>
      <Text>Contact</Text>
    </View>
  );
}
