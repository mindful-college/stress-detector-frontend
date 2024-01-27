import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useUserContext } from '../context/UserContext';
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
  const { state } = useUserContext();

  const getDataType = (dataType: string) => {
    switch (dataType) {
      case 'stepCounts':
        return 'step_count';
      case 'sleepHours':
        return 'sleep_hours';
      case 'studyHours':
        return 'study_hours';
      case 'workHours':
        return 'work_hours';
      case 'heartRate':
        return 'heart_rate';
      case 'socialMediaUsage':
        return 'social_media_usage';
      default:
        return null;
    }
  };

  const calculateMarginOfError = (type: string) => {
    if (!state.averageReportData) {
      return <Text>Unavailable</Text>;
    }

    const typeForCheckIn = getDataType(type);

    if (!typeForCheckIn) {
      return <Text>Unavailable</Text>;
    }

    const averageData = state.averageReportData[type];
    const checkInData = checkInInfo[typeForCheckIn];

    const minBoundary = Math.round(averageData * 0.9);
    const maxBoundary = Math.round(averageData * 1.1);

    if (checkInData < minBoundary) {
      return <Text style={styles.lowStyle}>Low</Text>;
    } else if (checkInData >= maxBoundary) {
      return <Text style={styles.highStyle}>High</Text>;
    } else {
      return <Text style={styles.normalStyle}>Normal</Text>;
    }
  };

  if (!state.averageReportData) {
    return <Text>Loading...</Text>;
  }

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
          {checkInInfo?.study_hours !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.study_hours} hrs</Text>
              <View>{calculateMarginOfError('studyHours')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
          {checkInInfo?.work_hours !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.work_hours} hrs</Text>
              <View>{calculateMarginOfError('workHours')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
          {checkInInfo?.sleep_hours !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.sleep_hours} hrs</Text>
              <View>{calculateMarginOfError('sleepHours')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
          {checkInInfo?.step_count !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.step_count}</Text>
              <View>{calculateMarginOfError('stepCounts')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
          {checkInInfo?.heart_rate !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.heart_rate} bpm</Text>
              <View>{calculateMarginOfError('heartRate')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
          {checkInInfo?.social_media_usage !== null ? (
            <View style={styles.bottomSectionBox}>
              <Text style={styles.lowerText}>{checkInInfo.social_media_usage} hrs</Text>
              <View>{calculateMarginOfError('socialMediaUsage')}</View>
            </View>
          ) : (
            <Text style={styles.lowerText}>N/A</Text>
          )}
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
  boxLowerSection: {
    marginTop: 17,
    marginLeft: 5,
  },
  lowerText: {
    fontSize: 20,
  },
  bottomSectionBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  lowStyle: {
    fontSize: 11,
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 4,
    color: 'limegreen',
    borderColor: 'limegreen',
    fontWeight: '700',
    marginTop: 5,
  },
  highStyle: {
    fontSize: 11,
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 4,
    color: 'hotpink',
    borderColor: 'hotpink',
    fontWeight: '700',
    marginTop: 5,
  },
  normalStyle: {
    fontSize: 11,
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 4,
    color: Colors.black,
    borderColor: Colors.black,
    fontWeight: '700',
    marginTop: 5,
  },
});
