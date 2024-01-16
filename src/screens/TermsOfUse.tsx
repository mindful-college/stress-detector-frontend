import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useUserContext } from '../context/UserContext';

export default function TermsOfUse() {
  const { dispatch } = useUserContext();

  useEffect(() => {
    dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: false }); // Hide the tab bar

    return () => dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: true }); // Show on unmount
  }, [dispatch]);
  return (
    <View>
      <Text>TermsOfUse</Text>
    </View>
  );
}
