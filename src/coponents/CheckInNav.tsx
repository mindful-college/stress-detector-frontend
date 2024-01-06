import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/colors';
import CheckIn from '../screens/CheckIn';
import Report from '../screens/Report';
import SettingNav from './SettingNav';
import { useUserContext } from '../context/UserContext';

export default function CheckInNav() {
  const Tab = createBottomTabNavigator();
  const { state } = useUserContext();

  const CustomTabBarLabel = ({ label, focused }) => (
    <Text style={focused ? styles.activeText : styles.inactiveText}>{label}</Text>
  );

  const CustomTabBarIcon = ({ focused, name }) => {
    if (name === 'CHECK-IN' && focused) {
      return <Image style={styles.icon} source={require(`../images/checkin_active.png`)} />;
    }
    if (name === 'CHECK-IN' && !focused) {
      return <Image style={styles.icon} source={require(`../images/checkin_inactive.png`)} />;
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
  return (
    <Tab.Navigator
      initialRouteName="REPORT"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: { display: state.isTabBarVisible ? 'flex' : 'none', height: 64 },
        tabBarLabel: ({ focused }) => <CustomTabBarLabel label={route.name} focused={focused} />,
        tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} name={route.name} />,
      })}>
      <Tab.Screen name="REPORT" component={Report} />
      <Tab.Screen name="CHECK-IN" component={CheckIn} />
      <Tab.Screen name="SETTING" component={SettingNav} options={{ headerShown: false }} />
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
