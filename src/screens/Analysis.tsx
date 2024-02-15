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
    const [monthlyData, setMonthlyData] = useState({});
    const { state, dispatch } = useUserContext();

    useEffect(() => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user?.access_token}`,
      };
    
      const getWeeklyData = async () => {
        try {
          const res = await axios.get(ANALYSIS_WEEKLY, { headers });
    
          if (res.status === 200) {
              // console.log(res.data)
              setWeeklyData(res.data)
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
              setMonthlyData(res.data)
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
          <Chart chartData={monthlyData}/>


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
