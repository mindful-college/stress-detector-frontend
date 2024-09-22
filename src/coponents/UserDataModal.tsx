import React, { useState } from 'react';
import { Text, StyleSheet, Modal, View } from 'react-native';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { getStepCount, getSleepHours, getHeartRate } from '../utils/checkin';
import { UserInputReport } from '../types/checkin';
import axios from 'axios';
import { CHECK_IN_URL } from '../utils/api';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataModal = ({ setCheckInInfo }: { setCheckInInfo: any }) => {
  const { state, dispatch } = useUserContext();
  const [studyHours, setStudyHours] = useState<null | number>(null);
  const [workHours, setWorkHours] = useState<null | number>(null);
  const [socialMediaUsage, setSocialMediaUsage] = useState<null | number>(null);

  const data = [
    { label: '0 hour', value: 0 },
    { label: '1 hour', value: 1 },
    { label: '2 hours', value: 2 },
    { label: '3 hours', value: 3 },
    { label: '4 hours', value: 4 },
    { label: '5 hours', value: 5 },
    { label: '6 hours', value: 6 },
    { label: '7 hours', value: 7 },
    { label: '8 hours', value: 8 },
    { label: '9 hours', value: 9 },
    { label: '10 hours', value: 10 },
    { label: '11 hours', value: 11 },
    { label: '12 hours', value: 12 },
    { label: '13 hours', value: 13 },
    { label: '14 hours', value: 14 },
    { label: '15 hours', value: 15 },
    { label: '16 hours', value: 16 },
    { label: '17 hours', value: 17 },
    { label: '18 hours', value: 18 },
    { label: '19 hours', value: 19 },
    { label: '20 hours', value: 20 },
    { label: '21 hours', value: 21 },
    { label: '22 hours', value: 22 },
    { label: '23 hours', value: 23 },
    { label: '24 hours', value: 24 },
  ];

  const onSubmitDailyCheckIn = async () => {
    const stepCount = state.permission?.stepCounts ? await getStepCount() : null;
    const sleepHours = state.permission?.sleepHours ? await getSleepHours() : null;
    const heartRate = state.permission?.sleepHours ? await getHeartRate() : null;
    const date = new Date();
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    const finalReport: UserInputReport = {
      study_hours: studyHours,
      work_hours: workHours,
      step_count: stepCount as number | null,
      sleep_hours: sleepHours as number | null,
      heart_rate: heartRate as number | null,
      social_media_usage: socialMediaUsage,
      date: localDate,
    };
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user?.access_token}`,
      };
      const { status } = await axios.post(CHECK_IN_URL, finalReport, { headers });
      if (status === 200) {
        const today = new Date();
        AsyncStorage.setItem('lastDailyCheckInDate', today.toISOString());
        setCheckInInfo(finalReport);
        dispatch({ type: 'UPDATE_POINTS', payload: (state.user?.points ?? 0) + 100 });
        dispatch({ type: 'UPDATE_DAILY_CHECKIN_MODAL', payload: false });
        setStudyHours(0);
        setWorkHours(0);
        setSocialMediaUsage(0);
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Please restart the conversation.',
      });
    }
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const onCloseDailyCheckIn = () => {
    dispatch({ type: 'UPDATE_DAILY_CHECKIN_MODAL', payload: false });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={state.dailyCheckInModal}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>END OF DAY CHECK-IN</Text>
          <View>
            <Text>Hours you studied</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select hours you studied.."
              value={studyHours}
              onChange={(item) => {
                setStudyHours(item.value);
              }}
              renderItem={renderItem}
            />
          </View>
          <View>
            <Text>Hours you worked</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select hours you worked.."
              value={workHours}
              onChange={(item) => {
                setWorkHours(item.value);
              }}
              renderItem={renderItem}
            />
          </View>
          <View>
            <Text>Hours you used social media</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select hours you used social media.."
              value={socialMediaUsage}
              onChange={(item) => {
                setSocialMediaUsage(item.value);
              }}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <CustomButton title="SKIP" color={Colors.primary} onPress={onCloseDailyCheckIn} />
            <CustomButton
              title="SUBMIT"
              textStyle={styles.fullButtonText}
              style={styles.fullButtonStyle}
              color={Colors.primary}
              onPress={onSubmitDailyCheckIn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    position: 'absolute',
    bottom: 200,
    width: '100%',
    borderWidth: 2,
    padding: 24,
    borderRadius: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Colors.black,
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullButtonText: {
    color: Colors.white,
  },
  fullButtonStyle: {
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
});

export default UserDataModal;
