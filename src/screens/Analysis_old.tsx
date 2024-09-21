import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Swiper from 'react-native-swiper';
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { ANALYSIS_WEEKLY, ANALYSIS_MONTHLY } from '../utils/api';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { moderateScale, verticalScale } from '../themes/metrics';
import Chart from '../coponents/Chart';
export default function Analysis() {
  const [weeklyData, setWeeklyData] = useState({
    days: [['']],
    stress_level: [[0]],
    heart_rate: [[0]],
    sleep_hours: [[0]],
    social_media_usage: [[0]],
    step_count: [[0]],
    study_hours: [[0]],
    work_hours: [[0]],
  });
  // const [monthlyData, setMonthlyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({
    months: [['']],
    stress_level: [[0]],
    heart_rate: [[0]],
    sleep_hours: [[0]],
    social_media_usage: [[0]],
    step_count: [[0]],
    study_hours: [[0]],
    work_hours: [[0]],
  });
  const { state, dispatch } = useUserContext();
  const [maxCount, setMaxCount] = useState(9999);
  const [value, setValue] = useState('weekly');
  const [heartRatePerm, setHeartRatePerm] = useState(false);
  const [stepCountPerm, setStepCountPerm] = useState(false);
  const [sleepHoursPerm, setSleepHoursPerm] = useState(false);
  const [socialMediaPerm, setSocialMediaPerm] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  useEffect(() => {
    // Check the specific permission, adjust according to your state structure
    const heart_permission = state.permission?.heartRate || false;
    const step_permission = state.permission?.stepCounts || false;
    const sleep_permission = state.permission?.sleepHours || false;
    const social_permission = state.permission?.socialMediaUsage || false;

    setHeartRatePerm(heart_permission);
    setSleepHoursPerm(sleep_permission);
    setSocialMediaPerm(social_permission);
    setStepCountPerm(step_permission);
  }, [state.permission]);

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };

    const getWeeklyData = async () => {
      try {
        const res = await axios.get(ANALYSIS_WEEKLY, { headers });

        if (res.status === 200) {
          setWeeklyData(res.data);
          setMaxCount(res.data['stress_level'].length);
          setDayCount(res.data.days_count);
        }
      } catch (error) {
        // Handle errors if the request fails
        console.error(error);
      }
    };
    const getMonthlyData = async () => {
      try {
        const res = await axios.get(ANALYSIS_MONTHLY, { headers });

        if (res.status === 200) {
          // console.log(res.data)
          setMonthlyData(res.data);
          setMonthCount(res.data.month_count);
        }
      } catch (error) {
        // Handle errors if the request fails
        console.error(error);
      }
    };

    // Call the account function here to trigger the API request
    getWeeklyData();
    getMonthlyData();
  }, [state.user?.access_token]);

  const items = [
    {
      value: 'weekly',
    },
    {
      value: 'monthly',
    },
  ];

  type DropdownItem = {
    value: string;
  };

  const renderItem = (item: DropdownItem) => {
    // item.value === 'weekly'? :setMaxCount(monthlyData['months'].length-1)
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.itemContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={items}
          labelField="value"
          valueField="value"
          placeholder={value}
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
          renderItem={renderItem}
        />

        <View
          style={{
            height: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width,
          }}>
          <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
            {weeklyData && value && value === 'weekly' ? (
              dayCount && dayCount >= 3 ? (
                weeklyData['stress_level'].map((item, i) => {
                  console.log(maxCount);
                  return (
                    <Chart
                      key={`${value}stress${i}`}
                      min={0}
                      max={5}
                      chartData={weeklyData['stress_level'][i]}
                      chartLabel={weeklyData['days'][i]}
                      chartTitle="Stress Level"
                    />
                  );
                })
              ) : (
                <Text style={styles.noReportText}>There is no enough data for charts</Text>
              )
            ) : monthCount && monthCount >= 2 ? (
              monthlyData['stress_level'].map((item, i) => {
                return (
                  <Chart
                    key={`${value}stress${i}`}
                    min={0}
                    max={5}
                    chartData={monthlyData['stress_level'][i]}
                    chartLabel={monthlyData['months'][i]}
                    chartTitle="Stress Level"
                  />
                );
              })
            ) : (
              <Text style={styles.noReportText}>There is no enough data for charts</Text>
            )}
          </Swiper>
        </View>
        <View style={{ height: Dimensions.get('window').height / 2 }}>
          <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
            {weeklyData && value && value === 'weekly' ? (
              dayCount && dayCount >= 3 ? (
                weeklyData['study_hours'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}study${i}`}
                      min={0}
                      max={8}
                      chartData={weeklyData['study_hours'][i]}
                      chartLabel={weeklyData['days'][i]}
                      chartTitle="Study Hours"
                    />
                  );
                })
              ) : (
                <></>
              )
            ) : monthCount && monthCount >= 2 ? (
              monthlyData['study_hours'].map((item, i) => {
                return (
                  <Chart
                    key={`${value}study${i}`}
                    min={0}
                    max={8}
                    chartData={monthlyData['study_hours'][i]}
                    chartLabel={monthlyData['months'][i]}
                    chartTitle="Study Hours"
                  />
                );
              })
            ) : (
              <></>
            )}
          </Swiper>
        </View>
        <View style={{ height: Dimensions.get('window').height / 2 }}>
          <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
            {weeklyData && value && value === 'weekly' ? (
              dayCount && dayCount >= 3 ? (
                weeklyData['work_hours'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}work${i}`}
                      min={0}
                      max={8}
                      chartData={weeklyData['work_hours'][i]}
                      chartLabel={weeklyData['days'][i]}
                      chartTitle="Work Hours"
                    />
                  );
                })
              ) : (
                <></>
              )
            ) : monthCount && monthCount >= 2 ? (
              monthlyData['work_hours'].map((item, i) => {
                return (
                  <Chart
                    key={`${value}work${i}`}
                    min={0}
                    max={8}
                    chartData={monthlyData['work_hours'][i]}
                    chartLabel={monthlyData['months'][i]}
                    chartTitle="Work Hours"
                  />
                );
              })
            ) : (
              <></>
            )}
          </Swiper>
        </View>
        {socialMediaPerm && (
          <View style={{ height: Dimensions.get('window').height / 2 }}>
            <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
              {weeklyData && value && value === 'weekly' ? (
                dayCount && dayCount >= 3 ? (
                  weeklyData['social_media_usage'].map((item, i) => {
                    return (
                      <Chart
                        key={`${value}media${i}`}
                        min={0}
                        max={6}
                        chartData={weeklyData['social_media_usage'][i]}
                        chartLabel={weeklyData['days'][i]}
                        chartTitle="Social Media Usage"
                      />
                    );
                  })
                ) : (
                  <></>
                )
              ) : monthCount && monthCount >= 2 ? (
                monthlyData['social_media_usage'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}media${i}`}
                      min={0}
                      max={6}
                      chartData={monthlyData['social_media_usage'][i]}
                      chartLabel={monthlyData['months'][i]}
                      chartTitle="Social Media Usage"
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Swiper>
          </View>
        )}
        {sleepHoursPerm && (
          <View style={{ height: Dimensions.get('window').height / 2 }}>
            <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
              {weeklyData && value && value === 'weekly' ? (
                dayCount && dayCount >= 3 ? (
                  weeklyData['sleep_hours'].map((item, i) => {
                    return (
                      <Chart
                        key={`${value}sleep${i}`}
                        min={4}
                        max={8}
                        chartData={weeklyData['sleep_hours'][i]}
                        chartLabel={weeklyData['days'][i]}
                        chartTitle="Sleep Hours"
                      />
                    );
                  })
                ) : (
                  <></>
                )
              ) : monthCount && monthCount >= 2 ? (
                monthlyData['sleep_hours'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}sleep${i}`}
                      min={4}
                      max={8}
                      chartData={monthlyData['sleep_hours'][i]}
                      chartLabel={monthlyData['months'][i]}
                      chartTitle="Sleep Hours"
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Swiper>
          </View>
        )}
        {stepCountPerm && (
          <View style={{ height: Dimensions.get('window').height / 2 }}>
            <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
              {weeklyData && value && value === 'weekly' ? (
                dayCount && dayCount >= 3 ? (
                  weeklyData['step_count'].map((item, i) => {
                    return (
                      <Chart
                        key={`${value}step${i}`}
                        min={0}
                        max={8000}
                        chartData={weeklyData['step_count'][i]}
                        chartLabel={weeklyData['days'][i]}
                        chartTitle="Step Count"
                      />
                    );
                  })
                ) : (
                  <></>
                )
              ) : monthCount && monthCount >= 2 ? (
                monthlyData['step_count'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}step${i}`}
                      min={0}
                      max={8000}
                      chartData={monthlyData['step_count'][i]}
                      chartLabel={monthlyData['months'][i]}
                      chartTitle="Step Count"
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Swiper>
          </View>
        )}
        {heartRatePerm && (
          <View style={{ height: Dimensions.get('window').height / 2 }}>
            <Swiper loop={false} index={maxCount} showsPagination={false} showsButtons={false}>
              {weeklyData && value === 'weekly' ? (
                dayCount && dayCount >= 3 ? (
                  weeklyData['heart_rate'].map((item, i) => {
                    return (
                      <Chart
                        key={`${value}heart${i}`}
                        min={60}
                        max={140}
                        chartData={weeklyData['heart_rate'][i]}
                        chartLabel={weeklyData['days'][i]}
                        chartTitle="Heart Rate"
                      />
                    );
                  })
                ) : (
                  <></>
                )
              ) : monthCount && monthCount >= 2 ? (
                monthlyData['heart_rate'].map((item, i) => {
                  return (
                    <Chart
                      key={`${value}heart${i}`}
                      min={60}
                      max={140}
                      chartData={monthlyData['heart_rate'][i]}
                      chartLabel={monthlyData['months'][i]}
                      chartTitle="Heart Rate"
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Swiper>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  itemContainer: {
    // paddingHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    // justifyContent: 'center',
  },
  text: {
    fontSize: 12,
  },
  dropdown: {
    marginTop: 13,
    marginHorizontal: 15,
    height: 40,
    width: 120,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
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
  title: {
    fontSize: 15,
    color: Colors.black,
    textAlign: 'center',
    paddingBottom: 10,
    marginHorizontal: '5%',
  },
  noReportText: {
    marginTop: verticalScale(100),
    textAlign: 'center',
    fontSize: moderateScale(20),
  },
});
