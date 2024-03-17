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
};

// Permission for health data access
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
    write: [],
  },
} as HealthKitPermissions;

export default function ToggleButton({ item }: toggleButtonProps) {
  //userinfo in Reducer
  const { state, dispatch } = useUserContext();
  //Bool for toggle button
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
  //Bool for device setting permission
  const [permission, setPermission] = useState(false);
  console.log(JSON.stringify(permissions));
  const getToggleEnabled = () => {
    switch (item) {
      case 'Step Count':
        setIsToggleEnabled(state.permission?.stepCounts || false);
        break;
      case 'Sleep Hours':
        setIsToggleEnabled(state.permission?.sleepHours || false);
        break;
      case 'Heart Rate':
        setIsToggleEnabled(state.permission?.heartRate || false);
        break;
      case 'Social Media Usage':
        setIsToggleEnabled(state.permission?.socialMediaUsage || false);
        break;
      case 'Notification':
        setIsToggleEnabled(state.permission?.notification || false);
        break;
      default:
        break;
    }
    return;
  };

  //Link to mobile setting page
  const toSetting = () => {
    requestNotifications(['alert', 'sound']).then(({ status, settings }) => {});
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const showModal = () => {
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
  };

  // Send API Request to update permission
  const updatePermission = async (newPermission) => {
    // Header for API call
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };
    //Text justification for API call
    const get_permission_type = () => {
      let permission_type = item.toLowerCase();
      let permission_type_split = permission_type.split(' ');
      let permission_type_result = '';
      for (let i = 0; i < permission_type_split.length; i++) {
        if (i !== 0) {
          permission_type_result += '_';
        }
        permission_type_result += permission_type_split[i];
      }
      return permission_type_result;
    };
    try {
      const res = await axios.put(
        `${PERMISSION_URL}?permission_type=${get_permission_type()}&permission=${newPermission}`,
        {},
        { headers },
      );
      // check response to set Permission
      if (res.status === 200) {
        //update reducer
        dispatch({ type: 'SET_PERMISSION', payload: res.data });
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
                // setIsToggleEnabled(false);
                //Set false in server data
                if (state.permission?.notification === true) {
                  updatePermission(false);
                }
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
    getToggleEnabled();
  });

  useEffect(() => {
    //To set initial data
    checkNotificationPermission();
  }, [permission]);

  useEffect(() => {
    //To handle permission after mobile setting changed
    const listener = AppState.addEventListener('change', checkNotificationPermission);
    return () => {
      listener.remove();
    };
  }, [permission]);

  //To handle switch toggle button
  const toggleSwitch = async () => {
    if (!permission) {
      //error toast message
      Toast.show({
        type: 'error',
        text1: `Cannot change the permission for ${item}`,
      });

      // Alert Modal
      showModal();
    } else {
      //success toast message
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
