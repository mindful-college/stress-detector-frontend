import React, { useState } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

import axios from 'axios';
import { GET_REPORT_DATA_URL, GET_CHECKIN_DATA_URL } from '../utils/api';
import { useUserContext } from '../context/UserContext';
import FaceSvg from '../coponents/FaceSvg';
import CheckInSummary from '../coponents/CheckInSummary';
import CheckInInfo from '../coponents/CheckInInfo';

export default function Report() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [checkInSummary, setCheckInSummary] = useState({ text: [], voice: [] });
  const [checkInInfo, setCheckInInfo] = useState({
    date: new Date(),
    email: '',
    heart_rate: 0,
    sleep_hours: 0,
    social_media_usage: 0,
    step_count: 0,
    stress_level: 0,
    study_hours: 0,
    work_hours: 0,
  });
  const [hasReportData, setHasReportData] = useState(false);

  const { state, dispatch } = useUserContext();
  const userToken = state.user?.access_token;

  useFocusEffect(
    React.useCallback(() => {
      //
      const dateString = selectedDate.format(); // Convert moment object to string (ISO 8601 format)

      const getReportData = async () => {
        try {
          const response = await axios.get(`${GET_REPORT_DATA_URL}?date_str=${dateString}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (response.data.message) {
            setHasReportData(false);
          } else {
            setHasReportData(true);
            setStressLevel(response.data.stress_level);
            setCheckInSummary(response.data.summary);
          }

          //
        } catch (error) {
          console.error('Error getting report data from Database', error);
          setHasReportData(false);
        }
      };

      const getCheckinData = async () => {
        try {
          const response = await axios.get(`${GET_CHECKIN_DATA_URL}?date_str=${dateString}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          console.log(response.data);

          setCheckInInfo(response.data);
        } catch (error) {
          console.error('Error getting check in data from Database', error);
        }
      };

      if (userToken && selectedDate) {
        getReportData();
        getCheckinData();
      }
    }, [selectedDate, userToken]),
  );

  //

  const datesBlacklistFunc = (date) => {
    return date.isAfter(moment(), 'day');
  };

  const handleDateSelection = async (selectedMoment) => {
    setSelectedDate(selectedMoment);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendarContainer}
        calendarColor={Colors.white}
        calendarHeaderStyle={styles.calendarHeader}
        calendarHeaderFormat={'MMMM YYYY'}
        onHeaderSelected={() => setIsModalVisible(true)}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        iconContainer={{ flex: 0.1 }}
        highlightDateNumberStyle={styles.highlightDateNumber}
        highlightDateContainerStyle={styles.highlightDateContainer}
        highlightDateNameStyle={styles.highlightDateName}
        datesBlacklist={datesBlacklistFunc}
        selectedDate={selectedDate}
        startingDate={selectedDate}
        onDateSelected={(date) => handleDateSelection(date)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.calendarModalContainer}
          onPress={() => setIsModalVisible(false)}>
          <Calendar
            initialDate={moment().toString()}
            theme={{
              textMonthFontWeight: '600',
              textMonthFontSize: 15,
            }}
            style={styles.calendarInModal}
            onDayPress={(day) => handleDateSelection(moment(day.dateString))}
          />
        </TouchableOpacity>
      </Modal>
      <ScrollView>
        {hasReportData ? (
          <>
            <View style={styles.stressLevelSvgContainer}>
              <FaceSvg stressLevel={stressLevel} />
            </View>
            <View style={styles.checkInSummaryContainer}>
              <CheckInSummary checkInSummary={checkInSummary} />
            </View>
            <View style={styles.checkInInfoContainer}>
              <CheckInInfo checkInInfo={checkInInfo} />
            </View>
          </>
        ) : (
          <Text style={styles.noReportText}>There is no report for this date</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Calendar
  calendarContainer: {
    display: 'flex',
    textAlign: 'center',
    height: 100,
    paddingTop: 13,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey,
  },
  calendarHeader: { color: 'black', fontSize: 15, fontWeight: '500', textTransform: 'uppercase' },
  dateNumber: { color: 'black', fontSize: 17, fontWeight: '400' },
  dateName: { color: 'black', fontWeight: '600' },
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
    fontSize: 9,
    fontWeight: '900',
  },

  // Calendar in Modal
  calendarModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarInModal: {
    height: 360,
    borderRadius: 10,
  },

  // date with no report
  noReportText: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 20,
  },

  // stressLevelSvg
  stressLevelSvgContainer: {
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 2,
  },

  // checkInSummary
  checkInSummaryContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
    borderWidth: 2,
  },

  // checkInInfo
  checkInInfoContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
});
