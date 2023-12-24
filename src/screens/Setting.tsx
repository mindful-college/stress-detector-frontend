import React, { useState } from 'react';
import { Button, View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import { SING_OUT_URL } from '../utils/api';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/colors';
import CustomLink from '../coponents/CustomLink';
import ToggleButton from '../coponents/ToggleButton';
import CustomeButton from '../coponents/CustomButton';

export default function Setting({ navigation }) {
  const { state, dispatch } = useUserContext();
  const [userInfo, setUserInfo] = useState({
    username: 'Sample Name',
    points: '1000',
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState([
    'Step Counts',
    'Sleep Hours',
    'Heart Rate',
    'Social Media Usage',
    'Notification',
  ]);
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

  const handleEdit = () => {
    setIsEnabled(!isEnabled);
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

  const DrawItemWithToggle = (props) => (
    <View style={styles.block}>
      <Text style={styles.item}>{props.item}</Text>
      <ToggleButton />
    </View>
  );

  const DrawItemWithLink = (props) => (
    <View style={styles.block}>
      <Text style={styles.item}>{props.item}</Text>
      {checkSupportType(props.item)}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Account</Text>
        <View style={styles.block}>
          {isEnabled ? (
            <Text style={styles.item}>!!</Text>
          ) : (
            <Text style={styles.item}>{userInfo.username}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            // style={[styles.buttonText, { color }]}
            onPress={handleEdit}>
            <Text style={styles.buttonText}>{isEnabled ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          {/* <CustomeButton title="Edit" color={Colors.primary}/> */}
        </View>
        <View style={styles.block}>
          <Text style={styles.item}>{userInfo.points} Points</Text>
        </View>
      </View>

      <View>
        <Text style={styles.title}>Permission Setting</Text>
        {permission.map((item) => (
          <DrawItemWithToggle item={item} />
        ))}
      </View>

      <View>
        <Text style={styles.title} />
        {support.map((item) => (
          <DrawItemWithLink item={item} />
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
    width: '100%',
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
