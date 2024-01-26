import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/colors';
import Book from '../svg/study.svg';
import Social from '../svg/social_media_usage.svg';

type CheckInInfoProps = {
  checkInInfo: {
    date: Date;
    email: string;
    heart_rate: number;
    sleep_hours: number;
    social_media_usage: number;
    step_count: number;
    stress_level: number;
    study_hours: number;
    work_hours: number;
  };
};

const CheckInInfo: React.FC<CheckInInfoProps> = ({ checkInInfo }) => {
  return (
    <View style={styles.checkInInfoInnerBox}>
      <View style={styles.box1}>
        <Book width={15} height={15} />
        <View>
          <Text>Study Hours</Text>
        </View>
        {checkInInfo && <Text>{checkInInfo.study_hours}</Text>}
      </View>
      {''}
      <View style={styles.box2}>
        <View>
          <Text>Work Hours</Text>
        </View>
        {checkInInfo && <Text>{checkInInfo.work_hours}</Text>}
      </View>
      {''}
      <View style={styles.box3}>
        <View>
          <Text>Sleep Hours</Text>
        </View>
        {checkInInfo && <Text>{checkInInfo.sleep_hours}</Text>}
      </View>
      {''}
      <View style={styles.box4}>
        <View>
          <Text>Step Counts</Text>
        </View>
        {checkInInfo && <Text>{checkInInfo.step_count}</Text>}
      </View>
      {''}
      <View style={styles.box5}>
        <View>
          <Text>Heart Rate</Text>
        </View>
        {checkInInfo && <Text>{checkInInfo.heart_rate}</Text>}
      </View>
      {''}
      <View style={styles.box6}>
        <Social width={15} height={15} />
        <View>
          <Text>Social Media Usage</Text>
        </View>

        {checkInInfo && <Text>{checkInInfo.social_media_usage}</Text>}
      </View>
    </View>
  );
};

export default CheckInInfo;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  checkInInfoInnerBox: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: 360,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  icon: {
    width: 13,
    height: 13,
  },
  box1: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderTopLeftRadius: 20,
  },
  box2: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderTopRightRadius: 20,
  },
  box3: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
  },
  box4: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
  },
  box5: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderBottomLeftRadius: 20,
  },
  box6: {
    borderWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderBottomRightRadius: 20,
  },
});
