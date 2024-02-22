import React, {useState, useEffect} from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Colors } from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { ANALYSIS_WEEKLY, ANALYSIS_MONTHLY } from "../utils/api";
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Chart from '../coponents/Chart';
export default function Analysis() {
    const [weeklyData, setWeeklyData] = useState({});
    const [monthlyData, setMonthlyData] = useState({"months":[['']], "stress_level": [[0]], "heart_rate":[[0]],
    "sleep_hours":[[0]], "social_media_usage": [[0]], "step_count":[[0]],
    "study_hours": [[0]], "work_hours": [[0]]});
    const { state, dispatch } = useUserContext();
    const [count, setCount] = useState(-9999999);
    const [maxCount, setMaxCount] = useState(-9999999);
    useEffect(() => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user?.access_token}`,
      };
    
      const getWeeklyData = async () => {
        try {
          const res = await axios.get(ANALYSIS_WEEKLY, { headers });
    
          if (res.status === 200) {

              // whole data
              let daysList = res.data['days'];
              let stressList = res.data['stress_level'];
              let heartRateList = res.data['heart_rate'];
              let sleepHoursList = res.data['sleep_hours'];
              let socialMediaUsageList = res.data['social_media_usage'];
              let stepCountList = res.data['step_count']
              let studyHoursList = res.data['study_hours'];
              let workHoursList = res.data['work_hours'];

              let dayList = ["Sun", "Mon", "Tue", "Wen", "Thur", "Fri", "Sat"]
              for(let i = 0; i < daysList.length; i++){
                daysList[i] = dayList[daysList[i]];
              }

              for(let i = 0; i < daysList.length; i++){
                if(!stepCountList[i]){
                  stepCountList[i] = 0;
                }
              }

              // parsed newList
              let parsedDaysList: Array<Array<string>> = [];
              let parsedStressList: Array<Array<number>> = [];
              let parsedHeartRateList: Array<Array<number>> = [];
              let parsedSleepHoursList: Array<Array<number>> = [];
              let parsedSocialMediaUsageList: Array<Array<number>> = [];
              let parsedStepCountList: Array<Array<number>> = [];
              let parsedStudyHoursList: Array<Array<number>> = [];
              let parsedWorkHoursList: Array<Array<number>> = [];
              let len = stressList.length;

              while(len > 0){
                parsedDaysList.unshift(daysList.slice(Math.max(len-7,0),len));
                parsedStressList.unshift(stressList.slice(Math.max(len-7,0),len));
                parsedHeartRateList.unshift(heartRateList.slice(Math.max(len-7,0),len));
                parsedSleepHoursList.unshift(sleepHoursList.slice(Math.max(len-7,0),len));
                parsedSocialMediaUsageList.unshift(socialMediaUsageList.slice(Math.max(len-7,0),len));
                parsedStepCountList.unshift(stepCountList.slice(Math.max(len-7,0),len));
                parsedStudyHoursList.unshift(studyHoursList.slice(Math.max(len-7,0),len));
                parsedWorkHoursList.unshift(workHoursList.slice(Math.max(len-7,0),len));
                stressList = stressList.slice(0,Math.max(len-7,0))
                len = stressList.length
              }

              setWeeklyData({ "days": parsedDaysList, "stress_level": parsedStressList, "heart_rate":parsedHeartRateList,
                              "sleep_hours": parsedSleepHoursList, "social_media_usage": parsedSocialMediaUsageList, "step_count":parsedStepCountList,
                              "study_hours": parsedStudyHoursList, "work_hours": parsedStudyHoursList })
              setMaxCount(parsedWorkHoursList.length)
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
              let monthsList = res.data['months'];
              let stressList = res.data['stress_level'];
              let heartRateList = res.data['heart_rate'];
              let sleepHoursList = res.data['sleep_hours'];
              let socialMediaUsageList = res.data['social_media_usage'];
              let stepCountList = res.data['step_count']
              let studyHoursList = res.data['study_hours'];
              let workHoursList = res.data['work_hours'];

              let monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
              for(let i = 0; i < monthsList.length; i++){
                monthsList[i] = monthList[monthsList[i]];
              }

              for(let i = 0; i < monthsList.length; i++){
                if(!stepCountList[i]){
                  stepCountList[i] = 0;
                }
              }

              // parsed newList
              let parsedMonthsList: Array<Array<string>> = [];
              let parsedStressList: Array<Array<number>> = [];
              let parsedHeartRateList: Array<Array<number>> = [];
              let parsedSleepHoursList: Array<Array<number>> = [];
              let parsedSocialMediaUsageList: Array<Array<number>> = [];
              let parsedStepCountList: Array<Array<number>> = [];
              let parsedStudyHoursList: Array<Array<number>> = [];
              let parsedWorkHoursList: Array<Array<number>> = [];
              let len = stressList.length;

              while(len > 0){
                parsedMonthsList.unshift(monthsList.slice(Math.max(len-6,0),len));
                parsedStressList.unshift(stressList.slice(Math.max(len-6,0),len));
                parsedHeartRateList.unshift(heartRateList.slice(Math.max(len-6,0),len));
                parsedSleepHoursList.unshift(sleepHoursList.slice(Math.max(len-6,0),len));
                parsedSocialMediaUsageList.unshift(socialMediaUsageList.slice(Math.max(len-6,0),len));
                parsedStepCountList.unshift(stepCountList.slice(Math.max(len-6,0),len));
                parsedStudyHoursList.unshift(studyHoursList.slice(Math.max(len-6,0),len));
                parsedWorkHoursList.unshift(workHoursList.slice(Math.max(len-6,0),len));
                stressList = stressList.slice(0,Math.max(len-6,0))
                len = stressList.length
              }

              // console.log(res.data)
              setMonthlyData({...monthlyData,
                              "months": parsedMonthsList, "stress_level": parsedStressList, "heart_rate":parsedHeartRateList,
                              "sleep_hours": parsedSleepHoursList, "social_media_usage": parsedSocialMediaUsageList, "step_count":parsedStepCountList,
                              "study_hours": parsedStudyHoursList, "work_hours": parsedStudyHoursList})
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
      }
    ];

    const [value, setValue] = useState('weekly');

    type DropdownItem = {
      value: string;
    };

    const renderItem = (item: DropdownItem) => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.value}</Text>
        </View>
      );
    };

    return (
      <View style={styles.container}>
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
          <ScrollView horizontal={true}>
            <Chart chartData={monthlyData['stress_level'][0]} chartLabel={monthlyData['months'][0]} chartTitle='stress level'></Chart>
            {/* {maxCount>0&&
              monthlyData['stress_level'].map((item, i)=>{
                <Chart chartData={monthlyData['stress_level'][i]} chartLabel={monthlyData['months'][i]} chartTitle='stress level'></Chart>})
            } */}
           </ScrollView>
            
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
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
});
