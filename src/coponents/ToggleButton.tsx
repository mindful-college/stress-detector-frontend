import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { PERMISSION_URL } from '../utils/api';
import Toast from 'react-native-toast-message';

type ToggleButtonProps = {
  item: string;
  isAllowed: boolean;
};

export default function ToggleButton(props: ToggleButtonProps) {
  const [isEnabled, setIsEnabled] = useState(props.isAllowed);
  const { state, dispatch } = useUserContext();

  const toggleSwitch = async () => {
    setIsEnabled((prev) => !prev);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };
    const permission_type = props.item.toLowerCase().replaceAll(' ', '_');
    try {
      const res = await axios.put(
        `${PERMISSION_URL}?permission_type=${permission_type}&permission=${!isEnabled}`,
        {},
        { headers },
      );

      Toast.show({
        type: 'success',
        text1: `${props.item} permission successfully changed.`,
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: `Network error - Failed to change ${props.item} permission.`,
      });
    }
  };
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ true: Colors.primary }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.grey}
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
