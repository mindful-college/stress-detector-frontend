import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SING_IN_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { emailRegex, passwordRegex } from '../utils/common';
import CustomButton from '../coponents/CustomButton';
import CustomLink from '../coponents/CustomLink';
import LoadingIndicator from '../coponents/LoadingIndicator';

export default function Signin({ navigation }) {
  const [user, setUser] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useUserContext();
  const handleSignIn = async () => {
    if (!emailRegex.test(user.email)) {
      Toast.show({
        type: 'error',
        text1: 'Email must be valid format',
      });
      return;
    }
    if (!passwordRegex.test(user.password)) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 8 characters',
      });
      return;
    }
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append('username', user.email);
      form.append('password', user.password);
      const { data } = await axios.post(SING_IN_URL, form);
      const userObj = {
        email: user.email,
        access_token: data.access_token,
      };
      AsyncStorage.setItem('user', JSON.stringify(userObj));
      dispatch({ type: 'SET_USER', payload: userObj });
      setUser({ email: '', password: '' });
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEamil = (email) => {
    setUser((prevUser) => ({ ...prevUser, email }));
  };

  const handlePassword = (password) => {
    setUser((prevUser) => ({ ...prevUser, password }));
  };

  const goToSignUp = () => {
    navigation.navigate('SIGNUP');
  };

  const checkIfAllFieldsNotEmpty = () => {
    return user.email && user.password;
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>MINDFUL COLLEGE</Text>
            <Text style={styles.subText}>Stress Detector</Text>
            <View style={styles.badgeWrapper}>
              <Text style={styles.badgeText}>BETA</Text>
            </View>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputWrapper}>
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
            {checkIfAllFieldsNotEmpty() ? (
              <CustomButton
                color={Colors.white}
                backgroundColor={Colors.primary}
                title="Sign In"
                onPress={handleSignIn}
              />
            ) : (
              <CustomButton
                color={Colors.black}
                backgroundColor={Colors.grey}
                title="Sign In"
                disabled={true}
              />
            )}
            <View style={styles.linkWrapper}>
              <CustomLink handleNavigate={goToSignUp} color={Colors.primary} text="Sign Up" />
              {/* <CustomLink
                handleNavigate={goToSignUp}
                color={Colors.primary}
                text="Reset Password"
              /> */}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      <LoadingIndicator isLoading={isLoading} color={Colors.secondary} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.primary,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 48,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  linkWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginVertical: 20,
  },
  logo: {
    position: 'absolute',
    top: 120,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  logoText: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: '600',
  },
  subText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
    marginTop: 20,
  },
  badgeWrapper: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.white,
  },
});
