import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SING_IN_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { emailRegex } from '../utils/common';

export default function Signin() {
  const [user, setUser] = useState({ email: '', password: '' });
  const { dispatch } = useUserContext();

  const handleSignIn = async () => {
    if (!emailRegex.test(user.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email format',
      });
      return;
    }
    try {
      const form = new FormData();
      form.append('username', user.email);
      form.append('password', user.password);
      const { data } = await axios.post(SING_IN_URL, form);
      const userObj = { email: user.email, access_token: data.access_token };
      AsyncStorage.setItem('user', JSON.stringify(userObj));
      dispatch({ type: 'SET_USER', payload: userObj });
    } catch (e) {
      if (e.response?.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'Incorrect email or password',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
        });
      }
    }
  };

  const handleEamil = (email) => {
    setUser((prevUser) => ({ ...prevUser, email }));
  };

  const handlePassword = (password) => {
    setUser((prevUser) => ({ ...prevUser, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={handleEamil}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={user.password}
        onChangeText={handlePassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});
