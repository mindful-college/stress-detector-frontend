import React, { useState,useEffect } from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Colors } from '../utils/colors';

type chartData = {
    chartData: number[],
    chartLabel: string[],
    chartTitle: string
}


export default function Chart({chartData, chartLabel, chartTitle}:chartData) {
    const [chartValue, setChartValue] = useState([0]);
    const [label, setLabel] = useState(['']);
    const [title, setTitle] = useState('');
    useEffect(() => {
        if(chartData && chartLabel && chartTitle){
          setTitle(chartTitle)
          setLabel(chartData['months']);
          setChartValue(chartData['stress_level']);
        }
      }, [chartData]); // This effect runs on mount and whenever chartData changes

    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: true // optional
    };
    const screenWidth = Dimensions.get("window").width;
    const data = {
        labels: label,
        datasets: [
          {
            data: chartValue,
            color: (opacity = 1) => `rgba(249,80,1, ${opacity})`, // optional
            strokeWidth: 5 // optional
          }
        ],
        // legend: ["Rainy Days"] // optional
      };
    return (
      <View style={styles.container}>
              <LineChart
                    data={data}
                    width={screenWidth}
                    withDots={false}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
              />

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