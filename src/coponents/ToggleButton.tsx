import React, { useState, useEffect } from 'react';
import { Alert, View, Switch, StyleSheet, AppState } from 'react-native';
import { Colors } from '../utils/colors';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { PERMISSION_URL } from '../utils/api';
import { checkNotifications, openSettings, requestNotifications } from 'react-native-permissions';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health';
import Toast from 'react-native-toast-message';

type toggleButtonProps = {
  item: string;
  isAllowed: boolean;
};

// Permission for health data access
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.StepCount,
    ],
    write: [],
  },
} as HealthKitPermissions;

export default function ToggleButton({ item, isAllowed }: toggleButtonProps) {
  //Bool for toggle button
  const [isToggleEnabled, setIsToggleEnabled] = useState(isAllowed);
  //userinfo in Reducer
  const { state, dispatch } = useUserContext();
  //Bool for device setting permission
  const [permission, setPermission] = useState(false);

  //Link to mobile setting page
  const toSetting = () => {
    requestNotifications(['alert', 'sound']).then(({ status, settings }) => {});
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  // Send API Request to update permission
  const updatePermission = async (newPermission) => {
    // Header for API call
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };
    //Text justification for API call
    const permission_type = item.toLowerCase().replace(' ', '_');
    try {
      const res = await axios.put(
        `${PERMISSION_URL}?permission_type=${permission_type}&permission=${newPermission}`,
        {},
        { headers },
      );
      // check response to set Permission
      if (res.status === 200) {
        setIsToggleEnabled(newPermission);
      }
      //Handle error
    } catch (err) {
      console.error(err);
    }
  };

  // check Mobile setting permission
  const checkNotificationPermission =
    item === 'Notification'
      ? async () => {
          //get mobile setting notification permission
          await checkNotifications()
            .then((status) => {
              //set mobile setting permission in permission
              setPermission(status['status'] === 'granted');
              //Handle if it is denied
              if (status['status'] !== 'granted') {
                //Turn off the switch button
                setIsToggleEnabled(false);
                //Set false in server data
                updatePermission(false);
              }
            })
            //error handle for getting mobile setting permission
            .catch((error) => console.log('checkNotifications', error));
        }
      : async () => {
          // Implement Health Permission
          AppleHealthKit.initHealthKit(permissions, (error: string) => {
            /* Called after we receive a response from the system */

            if (error) {
              setIsToggleEnabled(false);
              updatePermission(false);
              setPermission(false);
              return;
            }
            setPermission(true);
          });
        };

  useEffect(() => {
    //To set initial data
    checkNotificationPermission();
    //To handle permission after mobile setting changed
    const listener = AppState.addEventListener('change', checkNotificationPermission);
    return () => {
      listener.remove();
    };
  }, [permission]);

  //To handle switch toggle button
  const toggleSwitch = async () => {
    if (!permission) {
      Toast.show({
        type: 'error',
        text1: `Cannot change the permission for ${item}`,
      });

      // Alert Modal
      Alert.alert(
        'Notifications blocked', // Title
        'Turn on Notifications to Allow "Stress Detect" to send alerts.', // Message
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'Setting', onPress: () => toSetting() },
        ],
        { cancelable: false },
      );
    } else {
      Toast.show({
        type: 'success',
        text1: 'Permission has been successfully changed',
      });
      updatePermission(!isToggleEnabled);
    }
  };

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ true: Colors.primary }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.grey}
        onValueChange={toggleSwitch}
        value={isToggleEnabled}
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
