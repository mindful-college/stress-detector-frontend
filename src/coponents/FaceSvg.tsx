import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

import HappyFaceSvg from '../svg/HappyFaceSvg';
import SadComponentSvg from '../svg/SadFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';

type FaceSvgProps = {
  reportData: {
    email: string;
    date: Date;
    summary: { text: string[]; voice: string[] };
    stress_level: number;
  };
};

const FaceSvg: React.FC<FaceSvgProps> = ({ reportData }) => {
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
    setStressLevelWord(stressLevelMap[reportData.stress_level]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData.stress_level]);

  const handleFaceSVG = (level: number) => {
    switch (level) {
      case 1:
        return (
          <HappyFaceSvg
            width={String(horizontalScale(130))}
            height={String(verticalScale(130))}
            strokeWidth="1.5"
            color="#000000"
          />
        );
      case 2:
        return (
          <SmileyFaceSvg
            width={String(horizontalScale(130))}
            height={String(verticalScale(130))}
            strokeWidth="1.5"
            color="#000000"
          />
        );
      case 3:
        return (
          <StraightFaceSvg
            width={String(horizontalScale(130))}
            height={String(verticalScale(130))}
            strokeWidth="1.5"
            color="#000000"
          />
        );
      case 4:
        return (
          <SadComponentSvg
            width={String(horizontalScale(130))}
            height={String(verticalScale(130))}
            strokeWidth="1.5"
            color="#000000"
          />
        );
      case 5:
        return (
          <ThrowUpFaceSvg
            width={String(horizontalScale(130))}
            height={String(verticalScale(130))}
            strokeWidth="1.5"
            color="#000000"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.facesvg}>{handleFaceSVG(reportData.stress_level)}</View>
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
    marginBottom: verticalScale(40),
  },
  stressLevelText: {
    fontSize: moderateScale(15),
    color: Colors.black,
    fontWeight: '500',
  },
  veryLow: {
    color: 'limegreen',
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
  low: {
    color: 'gold',
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
  moderate: {
    color: 'darkorange',
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
  high: {
    color: 'coral',
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
  veryHigh: {
    color: 'crimson',
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
  default: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: moderateScale(18),
  },
});
