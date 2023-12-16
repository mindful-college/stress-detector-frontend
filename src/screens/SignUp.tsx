import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors } from '../utils/colors';
import CustomButton from '../coponents/CustomButton';
import CustomLink from '../coponents/CustomLink';
import InputWithLabel from '../coponents/InputWithLabel';
import Toast from 'react-native-toast-message';
import { emailRegex, passwordRegex } from '../utils/common';
import axios from 'axios';
import { SING_UP_URL } from '../utils/api';
import DeviceInfo from 'react-native-device-info';
import LoadingIndicator from '../coponents/LoadingIndicator';

export default function Signup({ navigation }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
    password_check: '',
    name: '',
    uuid: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEamil = (email) => {
    setUser((prevUser) => ({ ...prevUser, email }));
  };

  const handlePassword = (password) => {
    setUser((prevUser) => ({ ...prevUser, password }));
  };

  const handlePasswordCheck = (password_check) => {
    setUser((prevUser) => ({ ...prevUser, password_check }));
  };

  const handleName = (name) => {
    setUser((prevUser) => ({ ...prevUser, name }));
  };

  const handleSignup = async () => {
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
    if (user.password !== user.password_check) {
      Toast.show({
        type: 'error',
        text1: 'Password and Password Check must match',
      });
      return;
    }
    try {
      setIsLoading(true);
      const { status } = await axios.post(SING_UP_URL, user);
      if (status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Your account has been successfully created',
        });
        setUser({
          email: '',
          password: '',
          password_check: '',
          name: '',
          uuid: '',
        });
        navigation.navigate('SignIn');
      }
    } catch (e) {
      if (e.response?.status === 409) {
        Toast.show({
          type: 'error',
          text1: e.response?.data?.detail,
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

  const goToSignIn = () => {
    navigation.navigate('SignIn');
  };

  const checkIfAllFieldsNotEmpty = () => {
    return user.email && user.name && user.password && user.password_check;
  };

  const getDeviceUniqueId = async () => {
    const uuid = await DeviceInfo.getUniqueId();
    setUser((prevUser) => ({ ...prevUser, uuid }));
  };

  useEffect(() => {
    getDeviceUniqueId();
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={styles.container}>
          <InputWithLabel
            label="Email"
            placeholder="Email"
            value={user.email}
            onChangeText={handleEamil}
          />
          <InputWithLabel
            label="Password"
            placeholder="Must be at least 8 characters"
            value={user.password}
            onChangeText={handlePassword}
            secureTextEntry={true}
          />
          <InputWithLabel
            label="Password Check"
            placeholder="Password Check"
            value={user.password_check}
            onChangeText={handlePasswordCheck}
            secureTextEntry={true}
          />
          <InputWithLabel
            label="Name"
            placeholder="Name"
            value={user.name}
            onChangeText={handleName}
          />
          {checkIfAllFieldsNotEmpty() ? (
            <CustomButton
              color={Colors.white}
              backgroundColor={Colors.primary}
              title="Sign Up"
              onPress={handleSignup}
            />
          ) : (
            <CustomButton
              color={Colors.black}
              backgroundColor={Colors.grey}
              title="Sign Up"
              disabled={true}
            />
          )}
          <View style={styles.linkWrapper}>
            <CustomLink handleNavigate={goToSignIn} color={Colors.primary} text="Sign In" />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <LoadingIndicator isLoading={isLoading} color={Colors.secondary} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  linkWrapper: {
    marginVertical: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: Colors.black,
  },
});
