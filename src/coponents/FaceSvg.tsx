import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

import HappyFaceSvg from '../svg/HappyFaceSvg';
import SadComponentSvg from '../svg/SadFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';

type FaceSvgProps = {
  stressLevel: number;
};

const FaceSvg: React.FC<FaceSvgProps> = ({ stressLevel }) => {
  //
  const stressLevelMap = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Very High',
  };

  const getColor = (word: string) => {
    switch (word) {
      case 'Very Low':
        return styles.veryLow;
      case 'Low':
        return styles.low;
      case 'Moderate':
        return styles.moderate;
      case 'High':
        return styles.high;
      case 'Very High':
        return styles.veryHigh;
      default:
        return styles.default;
    }
  };

  const [stressLevelWord, setStressLevelWord] = useState('');
  //
  useEffect(() => {
    setStressLevelWord(stressLevelMap[stressLevel]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stressLevel]);

  const handleFaceSVG = (level: number) => {
    switch (level) {
      case 1:
        return <HappyFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 2:
        return <SmileyFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 3:
        return <StraightFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 4:
        return <SadComponentSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      case 5:
        return <ThrowUpFaceSvg width="100" height="100" strokeWidth="2" color="#000000" />;
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.facesvg}>{handleFaceSVG(stressLevel)}</View>
      <View>
        {stressLevelWord && (
          <Text style={styles.stressLevelText}>
            Stress Level is <Text style={getColor(stressLevelWord)}>{stressLevelWord}</Text>
          </Text>
        )}
      </View>
    </>
  );
};

export default FaceSvg;

const styles = StyleSheet.create({
  facesvg: {
    marginBottom: 40,
  },
  stressLevelText: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: '500',
  },
  veryLow: { color: 'limegreen', fontWeight: '600', fontSize: 18 },
  low: { color: 'gold', fontWeight: '600', fontSize: 18 },
  moderate: { color: 'darkorange', fontWeight: '600', fontSize: 18 },
  high: { color: 'coral', fontWeight: '600', fontSize: 18 },
  veryHigh: { color: 'crimson', fontWeight: '600', fontSize: 18 },
  default: { color: Colors.black, fontWeight: '600', fontSize: 18 },
});
