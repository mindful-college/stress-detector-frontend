import React, { useState,useEffect } from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Colors } from '../utils/colors';

type chartData = {
    chartData: number[],
    chartLabel: string[],
    chartTitle: string,
    min: number,
    max: number,
}


export default function Chart({ chartData, chartLabel, chartTitle, min, max}:chartData) {
    const [chartValue, setChartValue] = useState([0]);
    const [label, setLabel] = useState(['']);
    const [title, setTitle] = useState('');
    useEffect(() => {
      if(chartData.length>3 && chartLabel.length>3 && chartTitle){
        setTitle(chartTitle)
        setLabel(chartLabel);
        setChartValue(chartData);
      }
      // console.log("chart")
      // console.log(chartValue, chartData)
      // console.log(label, chartLabel)
      // console.log(title, chartTitle)
      }, [chartData, chartLabel, chartTitle]); // This effect runs on mount and whenever chartData changes
    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        strokeWidth: 3, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: true, // optional
    };
    const screenWidth = Dimensions.get("window").width;
    const data = {
        labels: label,
        datasets: [
          {
            data: chartValue,
            color: (opacity = 1) => `rgba(249,80,1, ${opacity})`, // optional
            strokeWidth: 5 // optional
          },
          { data: [max,min], 
            color: () => 'rgba(255, 255, 255, 0)',
            // strokeDashArray: [0, 1000],
            withDots: false,
            // withShadow: false,
            // withInnerLines: false
          },
        ],
        // legend: ["Rainy Days"] // optional
      };
    return (
      <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              <LineChart
                    data={data}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    yAxisInterval={1}
                    withHorizontalLines={false}
                    withVerticalLines={false}
                    renderDotContent={({ x, y, indexData }) => (
                      <View
                          key = {`${x}${y}${indexData}`}
                          style={{
                              position: 'absolute',
                              left: x + 5, // Adjust these values to position your content correctly
                              top: y - 20, // Adjust these values to position your content correctly
                          }}>
                          <Text style={{ color: 'black', fontSize:8 }}>{indexData}</Text>
                      </View>
                  )}
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
      justifyContent: 'center',
    },
    title: {
      fontSize: 15,
      color: Colors.black,
      paddingBottom: '5%',
      marginVertical: '3%',
    }
})