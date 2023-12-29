import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import CustomLink from '../coponents/CustomLink';
// import ToggleButton from '../coponents/ToggleButton';
import Permission from '../coponents/Permission';
import Account from '../coponents/Account';

export default function Setting({ navigation }) {
  const { state, dispatch } = useUserContext();
  const [support, setSupport] = useState(['Contact Us', 'Terms of Use', 'Privacy Policy']);

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

  const checkSupportType = (name) => {
    if (name === 'Contact Us') {
      return <CustomLink handleNavigate={goToContact} color={Colors.primary} text="send" />;
    } else if (name === 'Terms of Use') {
      return <CustomLink handleNavigate={goToUse} color={Colors.primary} text="go" />;
    } else if (name === 'Privacy Policy') {
      return <CustomLink handleNavigate={goToPolicy} color={Colors.primary} text="go" />;
    }
    return;
  };

  const DrawItemWithLink = (props) => (
    <View style={styles.block}>
      <Text style={styles.item}>{props.item}</Text>
      {checkSupportType(props.item)}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* <Account />
      <Permission /> */}

      <View>
        <Text style={styles.title} />
        {support.map((item) => (
          <DrawItemWithLink item={item} key={item} />
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
});
