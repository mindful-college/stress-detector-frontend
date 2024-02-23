import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import CheckIn from '../screens/CheckIn';
import Report from '../screens/Report';
import Setting from '../screens/Setting';
import Analysis from '../screens/Analysis';

const CustomTabBarIcon = ({ focused, name }) => {
  if (name === 'CHECK-IN' && focused) {
    return <Image style={styles.icon} source={require(`../images/checkin_active.png`)} />;
  }
  if (name === 'CHECK-IN' && !focused) {
    return <Image style={styles.icon} source={require(`../images/checkin_inactive.png`)} />;
  }
  if (name === 'ANALYSIS' && focused) {
    return <Image style={styles.icon} source={require(`../images/analysis_active.png`)} />;
  }
  if (name === 'ANALYSIS' && !focused) {
    return <Image style={styles.icon} source={require(`../images/analysis_inactive.png`)} />;
  }
  if (name === 'REPORT' && focused) {
    return <Image style={styles.icon} source={require(`../images/report_active.png`)} />;
  }
  if (name === 'REPORT' && !focused) {
    return <Image style={styles.icon} source={require(`../images/report_inactive.png`)} />;
  }
  if (name === 'SETTING' && focused) {
    return <Image style={styles.icon} source={require(`../images/setting_active.png`)} />;
  }
  if (name === 'SETTING' && !focused) {
    return <Image style={styles.icon} source={require(`../images/setting_inactive.png`)} />;
  }
  return;
};

const CustomTabBarLabel = ({ label, focused }) => (
  <Text style={focused ? styles.activeText : styles.inactiveText}>{label}</Text>
);

export default function CheckInNav() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="REPORT"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: { height: 64 },
        tabBarLabel: ({ focused }) => <CustomTabBarLabel label={route.name} focused={focused} />,
        tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} name={route.name} />,
      })}>
      <Tab.Screen name="REPORT" component={Report} />
      <Tab.Screen name="ANALYSIS" component={Analysis} />
      <Tab.Screen name="CHECK-IN" component={CheckIn} />
      <Tab.Screen name="SETTING" component={Setting} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeText: {
    fontWeight: '500',
    fontSize: 12,
    color: Colors.primary,
  },
  inactiveText: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.black,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
