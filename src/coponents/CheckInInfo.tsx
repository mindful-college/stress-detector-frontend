import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useUserContext } from '../context/UserContext';
import { Colors } from '../utils/colors';
import StudyHours from '../svg/study.svg';
import SocialMediaUsage from '../svg/social_media.svg';
import WorkHours from '../svg/work.svg';
import StepCount from '../svg/step_count.svg';
import SleepHours from '../svg/sleep.svg';
import HeartRate from '../svg/heart_rate.svg';
import CheckInBox from './CheckInBox';

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
      <CheckInBox
        checkInInfo={checkInInfo?.study_hours}
        calculateMarginOfError={calculateMarginOfError}
        icon={<StudyHours width={20} height={20} />}
        contents={['Study Hours', 'hrs', 'studyHours']}
        style={styles.box1}
      />
      <CheckInBox
        checkInInfo={checkInInfo?.work_hours}
        calculateMarginOfError={calculateMarginOfError}
        icon={<WorkHours width={18} height={18} />}
        contents={['Work Hours', 'hrs', 'workHours']}
        style={styles.box2}
      />
      <CheckInBox
        checkInInfo={checkInInfo?.sleep_hours}
        calculateMarginOfError={calculateMarginOfError}
        icon={<SleepHours width={17} height={17} />}
        contents={['Sleep Hours', 'hrs', 'sleepHours']}
        style={styles.box3}
      />
      <CheckInBox
        checkInInfo={checkInInfo?.step_count}
        calculateMarginOfError={calculateMarginOfError}
        icon={<StepCount width={20} height={20} />}
        contents={['Step Counts', '', 'stepCounts']}
        style={styles.box4}
      />
      <CheckInBox
        checkInInfo={checkInInfo?.heart_rate}
        calculateMarginOfError={calculateMarginOfError}
        icon={<HeartRate width={20} height={20} />}
        contents={['Heart Rate', 'bpm', 'heartRate']}
        style={styles.box5}
      />
      <CheckInBox
        checkInInfo={checkInInfo?.social_media_usage}
        calculateMarginOfError={calculateMarginOfError}
        icon={<SocialMediaUsage width={20} height={20} />}
        contents={['Social Media Usage', 'hrs', 'socialMediaUsage']}
        style={styles.box6}
      />
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
