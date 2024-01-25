import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

type CheckInSummaryProps = {
  checkInSummary: {
    text: string[];
    voice: string[];
  };
};

const CheckInSummary: React.FC<CheckInSummaryProps> = ({ checkInSummary }) => {
  return (
    <>
      <View>
        <Text style={styles.checkInHeader}>Check-in Summary</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          We found "{''}
          {checkInSummary && <Text style={styles.keyWords}>{checkInSummary.text[0]}</Text>}", "
          {checkInSummary && <Text style={styles.keyWords}>{checkInSummary.text[1]}</Text>}"{' '}
          keywords from texts.
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          We detect "{''}
          {checkInSummary && <Text style={styles.keyWords}>{checkInSummary.voice[0]}</Text>}", "
          {checkInSummary && <Text style={styles.keyWords}>{checkInSummary.voice[1]}</Text>}" {''}
          voices from voices.
        </Text>
      </View>
    </>
  );
};

export default CheckInSummary;

const styles = StyleSheet.create({
  checkInHeader: {
    color: Colors.black,
    fontSize: 19,
    fontWeight: '500',
  },
  textContainer: {
    marginTop: 5,
  },
  text: { fontSize: 15, lineHeight: 24 },
  keyWords: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
