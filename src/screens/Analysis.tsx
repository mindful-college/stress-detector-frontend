/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { ANAYLYSIS_URL } from '../utils/api';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { moderateScale, verticalScale } from '../themes/metrics';
import moment from 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';

const MIN_REPORT_CNT = 3;

export default function Analysis() {
  const { state } = useUserContext();
  const [selectedDate, setSelectedDate] = useState('3-weeks');
  const [selectedChartLabel, setSelectedChartLabel] = useState('stress_level');
  const [stressLevelChart, setStressLevelChart] = useState([]);
  const [reportChart, setReportChart] = useState([]);
  const [processedChart, setProcessedChart] = useState({ labels: [], datasets: [{ data: [] }] });

  const heartRatePermission = state.permission?.heartRate || false;
  const stepCountPermission = state.permission?.stepCounts || false;
  const sleepHoursPermission = state.permission?.sleepHours || false;

  type DropdownItem = {
    label: string;
    value: string;
  };

  const charItem = [
    {
      label: 'Stree Level',
      value: 'stress_level',
    },
    // {
    //   label: 'Correlation',
    //   value: 'correlation',
    // },
    {
      label: 'Hours you studied',
      value: 'study_hours',
    },
    {
      label: 'Hours you worked',
      value: 'work_hours',
    },
    {
      label: 'sleep Hours',
      value: 'sleep_hours',
    },
    {
      label: 'Step Counts',
      value: 'step_count',
    },
    {
      label: 'Heart Rate',
      value: 'heart_rate',
    },
    {
      label: 'Social Media Usage',
      value: 'social_media_usage',
    },
  ];

  const dateItems = [
    {
      label: '~1W',
      value: 'week',
    },
    {
      label: '~2W',
      value: '2-weeks',
    },
    {
      label: '~3W',
      value: '3-weeks',
    },
  ];

  useEffect(() => {
    if (!state.user?.access_token) {
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };

    const getAnalysisData = async () => {
      try {
        const res = await axios.get(ANAYLYSIS_URL, { headers });
        if (res.status === 200) {
          setStressLevelChart(res.data.stress_level);
          setReportChart(res.data.report);
          makeChartData(res.data.stress_level);
        }
      } catch (error) {
        // Handle errors if the request fails
        console.error(error);
      }
    };

    getAnalysisData();
  }, []);

  useEffect(() => {
    if (selectedChartLabel === 'stress_level') {
      makeChartData(stressLevelChart);
    } else {
      makeChartData(reportChart);
    }
  }, [selectedChartLabel, selectedDate]);

  const makeChartData = (unprocessedData) => {
    const processedData = unprocessedData?.filter((item) => {
      const today = moment().startOf('day');
      let daysAgo = 0;
      if (selectedDate === 'week') {
        daysAgo = 7;
      }
      if (selectedDate === '2-weeks') {
        daysAgo = 14;
      }
      if (selectedDate === '3-weeks') {
        daysAgo = 21;
      }
      const startDate = moment().subtract(daysAgo, 'days').startOf('day');
      return moment(item._id).isBetween(startDate, today, null, '[]');
    });
    const data = {
      labels: processedData?.map((item) => item._id.slice(5)),
      datasets: [{ data: processedData?.map((item) => item[selectedChartLabel]?.toFixed(1) ?? 0) }],
    };
    setProcessedChart(data);
  };

  const renderItem = (item: DropdownItem) => {
    if (item.value === 'sleep-hours' && !sleepHoursPermission) {
      return;
    }
    if (item.value === 'step-counts' && !stepCountPermission) {
      return;
    }
    if (item.value === 'heart-rate' && !heartRatePermission) {
      return;
    }

    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const getBarWidth = () => {
    if (selectedDate === 'week') {
      return 1.0;
    }
    if (selectedDate === '2-weeks') {
      return 0.5;
    }
    if (selectedDate === '3-weeks') {
      return 0.1;
    }
  };
  const chartConfig = {
    backgroundGradientFrom: '#Ffffff',
    backgroundGradientTo: '#ffffff',
    barPercentage: getBarWidth(),
    decimalPlaces: 0, // optional, defaults to 2dp
    color: () => `rgba(1, 122, 205, 1)`,
    labelColor: () => `rgba(0, 0, 0, 1)`,

    style: {
      borderRadius: 16,
      fontFamily: 'Bogle-Regular',
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#efefef',
      strokeDasharray: '0',
    },
    propsForLabels: {
      fontFamily: 'Bogle-Regular',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return reportChart.length >= MIN_REPORT_CNT ? (
    <View style={styles.itemContainer}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={charItem}
        labelField="label"
        valueField="value"
        value={selectedChartLabel}
        onChange={(item) => {
          setSelectedChartLabel(item.value);
        }}
        renderItem={renderItem}
      />
      <View style={styles.menuWrapper}>
        {dateItems.map((item, idx) => {
          return (
            <TouchableOpacity
              key={`${item}-${idx}`}
              onPress={() => setSelectedDate(item.value)}
              style={item.value === selectedDate ? styles.selctedMenuItem : styles.menuItem}>
              <Text style={{ textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.chartWrapper}>
        {selectedChartLabel === 'correlation' ? (
          <View>
            <Text style={{ fontSize: 60, marginBottom: 20 }}>LineChart</Text>
            <View>
              <Text>Hours You Studied</Text>
              <Text>Hours You Worked</Text>
              <Text>Sleep Hours</Text>
              <Text>Step Counts</Text>
              <Text>Heart Rate</Text>
            </View>
          </View>
        ) : (
          <BarChart
            // style={styles.chart}
            showBarTops={false}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={0}
            data={processedChart}
            width={screenWidth - 15}
            height={400}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true}
          />
        )}
      </View>
    </View>
  ) : (
    <View style={styles.noChartWrapper}>
      <Text style={styles.noReportText}>There is no enough data for Analysis.</Text>
      <Text style={styles.noReportText}>You will be able to see the charts soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
  dropdown: {
    marginTop: 13,
    marginHorizontal: 15,
    height: 40,
    width: 200,
    borderRadius: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 2,
  },
  item: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  noReportText: {
    marginTop: verticalScale(10),
    textAlign: 'center',
    fontSize: moderateScale(20),
  },
  noChartWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    width: Dimensions.get('window').width,
  },
  menuWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40,
  },
  selctedMenuItem: {
    width: 80,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  menuItem: {
    width: 80,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
});
