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
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

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
    //
    const typeForCheckIn = getDataType(type);
    let minBoundary = 0;
    let maxBoundary = 0;

    if (!typeForCheckIn) {
      return <Text>Unavailable</Text>;
    }

    if (!state.averageReportData) {
      return <Text>Unavailable</Text>;
    }
    const averageData = state.averageReportData[type];
    const checkInData = checkInInfo[typeForCheckIn];

    if (typeForCheckIn === 'heart_rate') {
      minBoundary = Math.round(averageData * 0.85);
      maxBoundary = Math.round(averageData * 1.15);
    } else {
      minBoundary = Math.round(averageData * 0.9);
      maxBoundary = Math.round(averageData * 1.1);
    }

    if (checkInData < minBoundary) {
      if (
        typeForCheckIn === 'heart_rate' ||
        typeForCheckIn === 'step_count' ||
        typeForCheckIn === 'sleep_hours'
      ) {
        return <Text style={styles.lowStyleForHeartRate}>Low</Text>;
      } else {
        return <Text style={styles.lowStyle}>Low</Text>;
      }
    } else if (checkInData > maxBoundary) {
      if (typeForCheckIn === 'step_count' || typeForCheckIn === 'sleep_hours') {
        return <Text style={styles.lowStyle}>High</Text>;
      } else {
        return <Text style={styles.highStyle}>High</Text>;
      }
    } else {
      return <Text style={styles.normalStyle}>Normal</Text>;
    }
  };

  return (
    <View>
      <Text style={styles.title}>END OF DAY CHECK-IN</Text>
      <Text style={styles.info}>
        * High/low is based on comparisons to your personal data average
      </Text>
      <View style={styles.checkInInfoInnerBox}>
        <CheckInBox
          checkInInfo={checkInInfo?.study_hours}
          calculateMarginOfError={calculateMarginOfError}
          icon={<StudyHours width={horizontalScale(19)} height={horizontalScale(19)} />}
          contents={['Hours you studied', 'hrs', 'studyHours']}
        />
        <CheckInBox
          checkInInfo={checkInInfo?.work_hours}
          calculateMarginOfError={calculateMarginOfError}
          icon={<WorkHours width={horizontalScale(19)} height={verticalScale(19)} />}
          contents={['Hours you worked', 'hrs', 'workHours']}
        />
        <CheckInBox
          checkInInfo={checkInInfo?.sleep_hours?.toFixed(1)}
          calculateMarginOfError={calculateMarginOfError}
          icon={<SleepHours width={horizontalScale(17)} height={verticalScale(17)} />}
          contents={['Sleep Hours', 'hrs', 'sleepHours']}
        />
        <CheckInBox
          checkInInfo={checkInInfo?.step_count}
          calculateMarginOfError={calculateMarginOfError}
          icon={<StepCount width={horizontalScale(20)} height={verticalScale(20)} />}
          contents={['Step Counts', '', 'stepCounts']}
        />
        <CheckInBox
          checkInInfo={checkInInfo?.heart_rate}
          calculateMarginOfError={calculateMarginOfError}
          icon={<HeartRate width={horizontalScale(20)} height={verticalScale(20)} />}
          contents={['Heart Rate', 'bpm', 'heartRate']}
        />
        <CheckInBox
          checkInInfo={checkInInfo?.social_media_usage}
          calculateMarginOfError={calculateMarginOfError}
          icon={<SocialMediaUsage width={horizontalScale(20)} height={verticalScale(20)} />}
          contents={['Social Media Usage', 'hrs', 'socialMediaUsage']}
        />
      </View>
    </View>
  );
};

export default CheckInInfo;

const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontWeight: '500',
    color: Colors.black,
  },
  checkInInfoInnerBox: {
    display: 'flex',
    paddingHorizontal: horizontalScale(20),
    justifyContent: 'center',
    gap: 16,
  },
  lowStyle: {
    fontSize: moderateScale(11),
    borderWidth: 1,
    paddingVertical: verticalScale(1),
    paddingHorizontal: horizontalScale(3),
    borderRadius: 4,
    color: 'limegreen',
    borderColor: 'limegreen',
    fontWeight: '700',
    marginTop: verticalScale(5),
  },
  lowStyleForHeartRate: {
    fontSize: moderateScale(11),
    borderWidth: 1,
    paddingVertical: verticalScale(1),
    paddingHorizontal: horizontalScale(3),
    borderRadius: 4,
    color: 'hotpink',
    borderColor: 'hotpink',
    fontWeight: '700',
    marginTop: verticalScale(5),
  },
  highStyle: {
    fontSize: moderateScale(11),
    borderWidth: 1,
    paddingVertical: verticalScale(1),
    paddingHorizontal: horizontalScale(3),
    borderRadius: 4,
    color: 'hotpink',
    borderColor: 'hotpink',
    fontWeight: '700',
    marginTop: verticalScale(5),
  },
  normalStyle: {
    fontSize: moderateScale(11),
    borderWidth: 1,
    paddingVertical: verticalScale(1),
    paddingHorizontal: horizontalScale(3),
    borderRadius: 4,
    color: Colors.black,
    borderColor: Colors.black,
    fontWeight: '700',
    marginTop: verticalScale(5),
  },
});
