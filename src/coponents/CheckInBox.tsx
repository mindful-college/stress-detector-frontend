import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

type CheckInInfoProps = {
  checkInInfo: number | string;
  contents: string[];
  calculateMarginOfError: (type: string) => JSX.Element;
  icon: JSX.Element;
};

const CheckInBox: React.FC<CheckInInfoProps> = ({
  checkInInfo,
  calculateMarginOfError,
  icon,
  contents,
}) => {
  return (
    <View style={styles.container}>
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
  container: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  // box inside
  boxUpperSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: verticalScale(25),
  },
  upperSectionText: {
    fontSize: moderateScale(13),
    paddingTop: verticalScale(2),
    marginLeft: horizontalScale(5),
    fontWeight: '500',
    color: Colors.black,
  },
  boxLowerSection: {
    marginTop: verticalScale(17),
    marginLeft: horizontalScale(5),
  },
  lowerText: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(25),
  },
  bottomSectionBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: horizontalScale(10),
  },
});
