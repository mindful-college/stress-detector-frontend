import React, { useState,useEffect } from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Colors } from '../utils/colors';

type chartData = {
    chartData: object,
    eee: number[]
}


export default function Chart({chartData}:chartData) {
    const [chartValue, setChartValue] = useState([]);
    console.log('Months:', chartData['months']);
    console.log('Stress Level:', chartData['stress_level']);
    console.log('Chart Value:', chartValue);
    useEffect(() => {
        console.log(chartData)
        console.log(chartData['stress_level'])
        setChartValue(chartData['stress_level']);
      }, [chartData]); // This effect runs on mount and whenever chartData changes

    const arr = chartData['stress_level']
    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.8,
        useShadowColorFromDataset: true // optional
    };
    const screenWidth = Dimensions.get("window").width;
    const data = {
        labels: chartData['months'],
        datasets: [
          {
            data: [1,2,3,4,5],
            color: (opacity = 1) => `rgba(249,80,1, ${opacity})`, // optional
            strokeWidth: 5 // optional
          }
        ],
        // legend: ["Rainy Days"] // optional
      };
    return (
      <View style={styles.container}>
          <ScrollView horizontal={true}>
              <LineChart
                    data={data}
                    width={screenWidth}
                    withDots={false}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
              />
          </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex: 1,
      alignItems: 'center',
      backgroundColor: Colors.white,
      // justifyContent: 'center',
    }
})