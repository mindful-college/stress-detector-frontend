import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import CustomLink from '../coponents/CustomLink';

export default function Setting({navigation}) {
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

  const goToContact = () => {
    navigation.navigate('CONTACTUS');
  };
  const goToPolicy = () => {
    navigation.navigate('POLICY');
  };
  const goToUse = () => {
    navigation.navigate('TERMSOFUSE');
  };

  return (
    <View style={styles.container}>
      <View>
          <View style={styles.container1}>
            <Text>Contact Us</Text>
            <CustomLink handleNavigate={goToContact} color={Colors.primary} text="send" />
          </View>
          <View style={styles.container1}>
            <Text>Policy</Text>
            <CustomLink handleNavigate={goToPolicy} color={Colors.primary} text="go" />
          </View>
          <View style={styles.container1}>
            <Text>Terms of Use</Text>
            <CustomLink handleNavigate={goToUse} color={Colors.primary} text="go" />
          </View>
      </View>  
      <Button title="Sign Out" onPress={handleSignOut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
});
