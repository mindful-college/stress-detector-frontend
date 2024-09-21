import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

import axios from 'axios';
import { GET_REPORT_DATA_URL, GET_CHECKIN_DATA_URL } from '../utils/api';
import { useUserContext } from '../context/UserContext';
import FaceSvg from '../coponents/FaceSvg';
import CheckInInfo from '../coponents/CheckInInfo';
import LoadingIndicator from '../coponents/LoadingIndicator';
import CustomButton from '../coponents/CustomButton';
import UserDataModal from '../coponents/UserDataModal';

export default function Report() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useUserContext();
  const now = useMemo(() => new Date(), []);
  const userToken = state.user?.access_token;
  const [reportData, setReportData] = useState(null);
  const [checkInInfo, setCheckInInfo] = useState(null);

  const resetScrollViewPosition = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goToSelfCheckIn = useCallback(() => {
    dispatch({ type: 'UPDATE_DAILY_CHECKIN_MODAL', payload: true });
  }, [dispatch]);

  const fetchData = useCallback(async () => {
    try {
      const reportResponse = await axios.get(
        `${GET_REPORT_DATA_URL}?date_str=${selectedDate.format()}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      const checkinResponse = await axios.get(
        `${GET_CHECKIN_DATA_URL}?date_str=${selectedDate.format()}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      const [currentReportData, currentCheckinData] = await Promise.all([
        reportResponse,
        checkinResponse,
      ]);
      setReportData(currentReportData.data);
      setCheckInInfo(currentCheckinData.data);
      if (
        currentReportData.data !== null &&
        currentCheckinData.data === null &&
        now.getHours() >= 13
      ) {
        goToSelfCheckIn();
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  }, [userToken, goToSelfCheckIn, selectedDate, now]);

  useEffect(() => {
    if (selectedDate === null) {
      return;
    }
    setIsLoading(true);
    fetchData();
    resetScrollViewPosition();
  }, [selectedDate, fetchData]);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedDate(moment());
    }, []),
  );

  const datesBlacklistFunc = (date: moment.Moment) => {
    return date.isAfter(moment(), 'day');
  };

  const handleDateSelection = async (selectedMoment: moment.Moment) => {
    setSelectedDate(selectedMoment);
    setIsModalVisible(false);
  };

  // todo
  const canShowCheckInModal = () => {
    return now.getHours() >= 13 && reportData !== null && checkInInfo === null;
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
            maxDate={moment().format('YYYY-MM-DD')}
            theme={{
              textMonthFontWeight: '600',
              textMonthFontSize: 13,
            }}
            style={styles.calendarInModal}
            onDayPress={(day) => handleDateSelection(moment(day.dateString))}
          />
        </TouchableOpacity>
      </Modal>

      <ScrollView ref={scrollViewRef}>
        {reportData !== null ? (
          now.getHours() >= 13 || now.getDate().toString() !== selectedDate.format('D') ? (
            <>
              <View style={styles.stressLevelSvgContainer}>
                <FaceSvg reportData={reportData} />
              </View>
              <View style={styles.checkInInfoContainer}>
                {checkInInfo ? (
                  <CheckInInfo checkInInfo={checkInInfo} />
                ) : (
                  <View style={{ marginLeft: 30 }}>
                    {canShowCheckInModal() && (
                      <View>
                        <CustomButton
                          title="Go to End of Day CheckIn"
                          color={Colors.primary}
                          onPress={goToSelfCheckIn}
                          style={styles.selfCheckInBtn}
                          textStyle={styles.selfCheckInText}
                        />
                        <Text>This Check-in is to get the hours you studied,</Text>
                        <Text>worked, and used social media</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <LoadingIndicator isLoading={isLoading} color={Colors.black} isReportPage={true} />
            </>
          ) : (
            <Text style={styles.noReportText}>Daily Report opens after 9 pm</Text>
          )
        ) : (
          <>
            <Text style={styles.noReportText}>There is no Report on this date</Text>
            <LoadingIndicator isLoading={isLoading} color={Colors.black} isReportPage={true} />
          </>
        )}
      </ScrollView>
      <UserDataModal setCheckInInfo={setCheckInInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Calendar
  calendarContainer: {
    display: 'flex',
    textAlign: 'center',
    height: verticalScale(100),
    paddingTop: verticalScale(13),
    paddingBottom: verticalScale(5),
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey,
  },
  calendarHeader: {
    color: 'black',
    fontSize: moderateScale(13),
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dateNumber: { color: 'black', fontSize: moderateScale(17), fontWeight: '400' },
  dateName: { color: 'black', fontWeight: '600' },
  highlightDateContainer: {
    display: 'flex',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(100),
  },
  highlightDateNumber: {
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: moderateScale(17),
  },
  highlightDateName: {
    marginTop: verticalScale(2),
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: moderateScale(9),
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
    marginTop: verticalScale(100),
    textAlign: 'center',
    fontSize: moderateScale(20),
  },

  // stressLevelSvg
  stressLevelSvgContainer: {
    alignItems: 'center',
    marginTop: verticalScale(25),
  },

  // checkInSummary
  checkInSummaryContainer: {
    marginTop: verticalScale(40),
    paddingHorizontal: horizontalScale(30),
  },

  // checkInInfo
  checkInInfoContainer: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(30),
  },
  noSelfCheckInText: {
    color: Colors.black,
    fontSize: moderateScale(19),
    fontWeight: '500',
  },
  selfCheckInBtn: {
    marginTop: 0,
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  selfCheckInText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
