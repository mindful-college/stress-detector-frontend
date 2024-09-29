/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { ANAYLYSIS_URL } from '../utils/api';
import axios from 'axios';
import { moderateScale, verticalScale } from '../themes/metrics';
import moment from 'moment-timezone';
import LoadingIndicator from '../coponents/LoadingIndicator';

const MIN_REPORT_CNT = 3;

export default function Analysis() {
  const { state } = useUserContext();
  const [selectedDate, setSelectedDate] = useState('week');
  const [stressLevelChart, setStressLevelChart] = useState([]);
  const [reportChart, setReportChart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const heartRatePermission = state.permission?.heartRate || false;
  const stepCountPermission = state.permission?.stepCounts || false;
  const sleepHoursPermission = state.permission?.sleepHours || false;

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
      setIsLoading(true);
      try {
        const res = await axios.get(ANAYLYSIS_URL, { headers });
        if (res.status === 200) {
          const stressLevelChart = res.data.stress_level;
          const reportChart = res.data.report;
          const dateSet = new Set();
          for (const report of reportChart) {
            dateSet.add(report._id);
          }
          const proecessedStressLevels = [] as any;
          for (const item of stressLevelChart) {
            if (dateSet.has(item._id)) {
              proecessedStressLevels.push(item);
            }
          }
          setStressLevelChart(proecessedStressLevels);
          setReportChart(reportChart);
        }
      } catch (error) {
        // Handle errors if the request fails
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAnalysisData();
  }, []);

  const makeChartData = (unprocessedData, label) => {
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
      datasets: [
        {
          data: processedData?.map(
            (item) =>
              (label === 'stress_level' || label === 'sleep_hours'
                ? item[label]?.toFixed(1)
                : item[label]?.toFixed()) ?? 0,
          ),
        },
      ],
    };
    return data;
  };

  const getBarWidth = () => {
    if (selectedDate === 'week') {
      return 0.8;
    }
    if (selectedDate === '2-weeks') {
      return 0.4;
    }
    if (selectedDate === '3-weeks') {
      return 0.1;
    }
  };
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    barPercentage: getBarWidth(),
    decimalPlaces: 0, // optional, defaults to 2dp
    color: () => `rgba(26, 167, 236, 1)`,
    labelColor: () => Colors.black,
    strokeWidth: 2,
    style: {
      borderRadius: 16,
      fontFamily: 'Bogle-Regular',
    },
    propsForBackgroundLines: {
      strokeWidth: 1.5,
      stroke: '#efefef',
      strokeDasharray: '0',
    },
    propsForLabels: {
      fontFamily: 'Bogle-Regular',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  if (isLoading) {
    return <LoadingIndicator isLoading={isLoading} color={Colors.primary} isReportPage={true} />;
  }

  return stressLevelChart.length >= MIN_REPORT_CNT ? (
    <View style={styles.itemContainer}>
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
      <View style={{ marginBottom: 20, width: screenWidth }}>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, color: Colors.black }}>Stress Level</Text>
        </View>
        {/* <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          horizontal={true}
          contentOffset={{ x: 10000, y: 0 }} // i needed the scrolling to start from the end not the start
          showsHorizontalScrollIndicator={false} // to hide scroll bar
        > */}
        <BarChart
          style={styles.chart}
          showBarTops={true}
          showValuesOnTopOfBars={true}
          withInnerLines={true}
          segments={3}
          data={makeChartData(stressLevelChart, 'stress_level')}
          width={screenWidth}
          height={100}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          fromZero={true}
        />
        {/* </ScrollView> */}
      </View>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: screenWidth }}>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: Colors.black }}>Hours you studied</Text>
          </View>
          <BarChart
            style={styles.chart}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={3}
            data={makeChartData(reportChart, 'study_hours')}
            width={screenWidth}
            height={100}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: Colors.black }}>Hours you worked</Text>
          </View>
          <BarChart
            style={styles.chart}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={3}
            data={makeChartData(reportChart, 'work_hours')}
            width={screenWidth}
            height={100}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
        {sleepHoursPermission && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, color: Colors.black }}>Sleep Hours</Text>
            </View>
            <BarChart
              style={styles.chart}
              showBarTops={true}
              showValuesOnTopOfBars={true}
              withInnerLines={true}
              segments={3}
              data={makeChartData(reportChart, 'sleep_hours')}
              width={screenWidth}
              height={100}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              fromZero={true}
            />
          </View>
        )}
        {stepCountPermission && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, color: Colors.black }}>Step Counts</Text>
            </View>
            <BarChart
              style={styles.chart}
              showBarTops={true}
              showValuesOnTopOfBars={true}
              withInnerLines={true}
              segments={3}
              data={makeChartData(reportChart, 'step_count')}
              width={screenWidth}
              height={100}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              fromZero={true}
            />
          </View>
        )}
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: Colors.black }}>Social Media Usage</Text>
          </View>
          <BarChart
            style={styles.chart}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            segments={3}
            data={makeChartData(reportChart, 'social_media_usage')}
            width={screenWidth}
            height={100}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
        {heartRatePermission && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, color: Colors.black }}>Heart Rate</Text>
            </View>
            <BarChart
              style={styles.chart}
              showBarTops={true}
              showValuesOnTopOfBars={true}
              withInnerLines={true}
              segments={3}
              data={makeChartData(reportChart, 'heart_rate')}
              width={screenWidth}
              height={100}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              fromZero={true}
            />
          </View>
        )}
      </ScrollView>
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
    marginTop: 10,
    marginBottom: 20,
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
  chart: {
    marginLeft: -20,
  },
});
