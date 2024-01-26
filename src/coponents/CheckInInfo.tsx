import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../utils/colors';
import StudyHours from '../svg/study.svg';
import SocialMediaUsage from '../svg/social_media.svg';
import WorkHours from '../svg/work.svg';
import StepCount from '../svg/step_count.svg';
import SleepHours from '../svg/sleep.svg';
import HeartRate from '../svg/heart_rate.svg';

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
        <View style={styles.boxUpperSection}>
          <StudyHours width={20} height={20} />
          <View>
            <Text style={styles.upperSectionText}>Study Hours</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.study_hours}</Text>}
        </View>
      </View>
      {''}
      <View style={styles.box2}>
        <View style={styles.boxUpperSection}>
          <WorkHours width={18} height={18} />
          <View>
            <Text style={styles.upperSectionText}>Work Hours</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.work_hours}</Text>}
        </View>
      </View>
      {''}
      <View style={styles.box3}>
        <View style={styles.boxUpperSection}>
          <SleepHours width={17} height={17} />
          <View>
            <Text style={styles.upperSectionText}>Sleep Hours</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.sleep_hours}</Text>}
        </View>
      </View>
      {''}
      <View style={styles.box4}>
        <View style={styles.boxUpperSection}>
          <StepCount width={20} height={20} />
          <View>
            <Text style={styles.upperSectionText}>Step Counts</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.step_count}</Text>}
        </View>
      </View>
      {''}
      <View style={styles.box5}>
        <View style={styles.boxUpperSection}>
          <HeartRate width={20} height={20} />
          <View>
            <Text style={styles.upperSectionText}>Heart Rate</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.heart_rate}</Text>}
        </View>
      </View>
      {''}
      <View style={styles.box6}>
        <View style={styles.boxUpperSection}>
          <SocialMediaUsage width={20} height={20} />
          <View>
            <Text style={styles.upperSectionText}>Social Media Usage</Text>
          </View>
        </View>
        <View style={styles.boxLowerSection}>
          {checkInInfo && <Text>{checkInInfo.social_media_usage}</Text>}
        </View>
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
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },
  box2: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderTopRightRadius: 20,
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },
  box3: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },
  box4: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },
  box5: {
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderBottomLeftRadius: 20,
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },
  box6: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    height: 120,
    width: windowWidth * 0.44,
    borderBottomRightRadius: 20,
    paddingLeft: 10,
    paddingRight: 5,
    borderColor: Colors.black,
  },

  // box inside
  boxUpperSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
  },
  upperSectionText: {
    fontSize: 13,
    paddingTop: 2,
    marginLeft: 5,
    fontWeight: '500',
    color: Colors.black,
  },
});
