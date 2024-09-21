import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../utils/colors';
import { stressLevelMap } from '../utils/common';

type chartData = {
  chartData: number[];
  chartLabel?: string[] | undefined;
  chartTitle: string;
  min: number;
  max: number;
};

export default function Chart({ chartData, chartLabel, chartTitle, min, max }: chartData) {
  const [chartValue, setChartValue] = useState([0]);
  const [label, setLabel] = useState(['']);
  const [title, setTitle] = useState('');
  useEffect(() => {
    setTitle(chartTitle);
    setChartValue(chartData);
    if (chartLabel) setLabel(chartLabel);
  }, [chartData, chartLabel, chartTitle]); // This effect runs on mount and whenever chartData changes

  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.75,
    useShadowColorFromDataset: true, // optional
    withShadow: false,
    decimalPlaces: 0,
    style: {
      margin: 0,
    },
  };
  const screenWidth = Dimensions.get('window').width;
  const data = {
    labels: chartTitle === 'Stress Level' ? ['a', 'b', 'c', 'd', 'e'] : label,
    datasets: [
      {
        data: chartValue,
        color: (opacity = 1) => `rgba(26,167,236, ${opacity})`, // optional
        strokeWidth: 5, // optional
      },
      {
        data: [max, min],
        color: () => 'rgba(255, 255, 255, 0)',
        // strokeDashArray: [0, 1000],
        withDots: false,
        // withShadow: false,
        // withInnerLines: false
      },
    ],
    // legend: ["Rainy Days"] // optional
  };

  const covertStressData = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        withVerticalLabels={chartLabel !== undefined}
        data={data}
        width={screenWidth}
        height={120}
        withShadow={false}
        chartConfig={chartConfig}
        yAxisInterval={1}
        withDots={true}
        renderDotContent={({ x, y, indexData }) => (
          <View
            key={`${x}${y}${indexData}`}
            style={{
              position: 'absolute',
              left: x + 5, // Adjust these values to position your content correctly
              top: y - 20, // Adjust these values to position your content correctly
            }}>
            <Text style={{ color: 'black', fontSize: 10 }}>
              {chartTitle === 'Stress Level' ? stressLevelMap[Math.round(indexData)] : indexData}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
});
