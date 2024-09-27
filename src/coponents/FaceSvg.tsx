import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../utils/colors';
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

import HappyFaceSvg from '../svg/HappyFaceSvg';
import SadComponentSvg from '../svg/SadFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';
import { stressLevelMap } from '../utils/common';

type FaceSvgProps = {
  reportData: {
    email: string;
    date: Date;
    summary: { text: string[]; voice: string[] };
    stress_level: number;
    self_stress_level: number;
  };
};

const FaceSvg: React.FC<FaceSvgProps> = ({ reportData }) => {
  //

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
  const predictedStressLevel = Math.round(reportData.stress_level);
  const selfStressLevel = reportData.self_stress_level;

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
      <View style={styles.facesvg}>{handleFaceSVG(predictedStressLevel)}</View>
      {stressLevelMap[predictedStressLevel] && (
        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 20 }}>
          <View style={styles.stressLevelWrapper}>
            <View style={styles.row}>
              <View style={styles.leftCol}>
                <Text>Self-reported stress</Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={styles.textBold}>Predicted stress</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.leftCol}>
                <Text style={getColor(stressLevelMap[selfStressLevel])}>
                  {stressLevelMap[selfStressLevel]}
                </Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={[getColor(stressLevelMap[predictedStressLevel]), styles.textBold]}>
                  {stressLevelMap[predictedStressLevel]}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.reasonWrapper}>
            {/* <Text>Prediction Reason</Text> */}
            <Text style={styles.stressLevelText}>
              * GPT-3.5 predicted the stress level based on your diary data
            </Text>
            <Text style={styles.stressLevelText}>
              * It found "{''}
              {reportData.summary?.text?.map((item, idx) => (
                <Text key={idx} style={styles.keyWords}>
                  {idx !== reportData.summary?.text?.length - 1 ? `${item}, ` : item}
                </Text>
              ))}
              " keywords
            </Text>
          </View>
        </View>
      )}
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
    fontSize: moderateScale(20),
    paddingBottom: 10,
  },
  low: {
    color: '#ffbf00',
    fontSize: moderateScale(20),
    paddingBottom: 10,
  },
  moderate: {
    color: 'darkorange',
    fontSize: moderateScale(20),
    paddingBottom: 10,
  },
  high: {
    color: 'coral',
    fontSize: moderateScale(20),
    paddingBottom: 10,
  },
  veryHigh: {
    color: 'crimson',
    fontSize: moderateScale(20),
    paddingBottom: 10,
  },
  default: {
    color: Colors.black,
    fontSize: moderateScale(18),
  },
  stressLevelWrapper: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 8,
  },
  keyWords: {
    color: Colors.primary,
    fontWeight: '600',
  },
  reasonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: 8,
    marginBottom: 0,
    gap: 2,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftCol: {
    borderRightWidth: 1,
    borderColor: Colors.grey,
    padding: 10,
    width: '50%',
    paddingBottom: 0,
  },
  rightCol: {
    padding: 10,
    width: '50%',
    paddingBottom: 0,
  },
  textBold: {
    fontWeight: '600',
  },
});
