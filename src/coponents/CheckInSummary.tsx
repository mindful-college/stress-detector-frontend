import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { moderateScale, verticalScale } from '../themes/metrics';

type CheckInSummaryProps = {
  reportData: {
    email: string;
    date: Date;
    summary: { text: string[]; voice: string[] };
    stress_level: number;
  };
};

const CheckInSummary: React.FC<CheckInSummaryProps> = ({ reportData }) => {
  return (
    <>
      <View>
        <Text style={styles.checkInHeader}>Check-in Summary</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          We found "{''}
          {reportData.summary && <Text style={styles.keyWords}>{reportData.summary.text[0]}</Text>}
          ", "
          {reportData.summary && <Text style={styles.keyWords}>{reportData.summary.text[1]}</Text>}"
          keywords from texts.
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          We detect "{''}
          {reportData.summary && <Text style={styles.keyWords}>{reportData.summary.voice[0]}</Text>}
          ", "
          {reportData.summary && <Text style={styles.keyWords}>{reportData.summary.voice[1]}</Text>}
          " voices from voices.
        </Text>
      </View>
    </>
  );
};

export default CheckInSummary;

const styles = StyleSheet.create({
  checkInHeader: {
    color: Colors.black,
    fontSize: moderateScale(19),
    fontWeight: '500',
  },
  textContainer: {
    marginTop: verticalScale(5),
  },
  text: {
    fontSize: moderateScale(15),
    lineHeight: verticalScale(24),
  },
  keyWords: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
