import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../utils/colors';

type CheckInInfoProps = {
  checkInInfo: number;
  contents: string[];
  calculateMarginOfError: (type: string) => JSX.Element;
  icon: JSX.Element;
  style: object;
};

const CheckInBox: React.FC<CheckInInfoProps> = ({
  checkInInfo,
  calculateMarginOfError,
  icon,
  contents,
  style,
}) => {
  return (
    <View style={style}>
      <View style={styles.boxUpperSection}>
        {icon}
        <View>
          <Text style={styles.upperSectionText}>{contents[0]}</Text>
        </View>
      </View>
      <View style={styles.boxLowerSection}>
        {checkInInfo !== null ? (
          <View style={styles.bottomSectionBox}>
            <Text style={styles.lowerText}>
              {checkInInfo} {contents[1]}
            </Text>
            <View>{calculateMarginOfError(contents[2])}</View>
          </View>
        ) : (
          <Text style={styles.lowerText}>N/A</Text>
        )}
      </View>
    </View>
  );
};

export default CheckInBox;

const styles = StyleSheet.create({
  // box inside
  boxUpperSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
  },
  upperSectionText: {
    fontSize: 13,
    paddingTop: 2,
    marginLeft: 5,
    fontWeight: '500',
    color: Colors.black,
  },
  boxLowerSection: {
    marginTop: 17,
    marginLeft: 5,
  },
  lowerText: {
    fontSize: 20,
  },
  bottomSectionBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
});
