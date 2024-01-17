import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

export default function Report() {
  const datesBlacklistFunc = (date) => {
    return date.isAfter(moment(), 'day');
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        scrollable
        style={styles.calendarContainer}
        calendarColor={Colors.white}
        calendarHeaderStyle={styles.calendarHeader}
        calendarHeaderFormat={'MMMM'}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        iconContainer={{ flex: 0.1 }}
        highlightDateNumberStyle={styles.highlightDateNumber}
        highlightDateContainerStyle={styles.highlightDateContainer}
        highlightDateNameStyle={styles.highlightDateName}
        datesBlacklist={datesBlacklistFunc}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  calendarContainer: {
    height: 90,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey,
  },
  calendarHeader: { color: 'black', fontSize: 15, fontWeight: '500', textTransform: 'uppercase' },
  dateNumber: { color: 'black', fontSize: 17, fontWeight: '400' },
  dateName: { color: 'black' },
  highlightDateContainer: {
    display: 'flex',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
  highlightDateNumber: {
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: 17,
  },
  highlightDateName: {
    marginTop: 2,
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: 8,
  },
});
