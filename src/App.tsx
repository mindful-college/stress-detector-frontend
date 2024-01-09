import React, { useEffect, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CheckIn from './screens/CheckIn';
import Report from './screens/Report';
import Setting from './screens/Setting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignIn from './screens/SignIn';
import { UserContext, initialUser, userReducer } from './context/UserContext';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StyleSheet, Text, Image } from 'react-native';
import Signup from './screens/SignUp';
import { Colors } from './utils/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  const [state, dispatch] = useReducer(userReducer, initialUser);
  const contextValue = { state, dispatch };

  useEffect(() => {
    const checkToken = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
      }
    };
    checkToken();
  }, []);

  const CustomTabBarLabel = ({ label, focused }) => (
    <Text style={focused ? styles.activeText : styles.inactiveText}>{label}</Text>
  );

  const CustomTabBarIcon = ({ focused, name }) => {
    if (name === 'CHECK-IN' && focused) {
      return <Image style={styles.icon} source={require(`./images/checkin_active.png`)} />;
    }
    if (name === 'CHECK-IN' && !focused) {
      return <Image style={styles.icon} source={require(`./images/checkin_inactive.png`)} />;
    }
    if (name === 'REPORT' && focused) {
      return <Image style={styles.icon} source={require(`./images/report_active.png`)} />;
    }
    if (name === 'REPORT' && !focused) {
      return <Image style={styles.icon} source={require(`./images/report_inactive.png`)} />;
    }
    if (name === 'SETTING' && focused) {
      return <Image style={styles.icon} source={require(`./images/setting_active.png`)} />;
    }
    if (name === 'SETTING' && !focused) {
      return <Image style={styles.icon} source={require(`./images/setting_inactive.png`)} />;
    }
    return;
  };

  return (
    <UserContext.Provider value={contextValue}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          {!state.user ? (
            <Tab.Navigator
              initialRouteName="SIGNIN"
              screenOptions={() => ({
                tabBarStyle: {
                  display: 'none',
                },
              })}>
              <Tab.Screen name="SIGNIN" component={SignIn} />
              <Tab.Screen name="SIGNUP" component={Signup} />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator
              initialRouteName="REPORT"
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.primary,
                tabBarStyle: { height: 64 },
                tabBarLabel: ({ focused }) => (
                  <CustomTabBarLabel label={route.name} focused={focused} />
                ),
                tabBarIcon: ({ focused }) => (
                  <CustomTabBarIcon focused={focused} name={route.name} />
                ),
              })}>
              <Tab.Screen name="REPORT" component={Report} />
              <Tab.Screen name="CHECK-IN" component={CheckIn} />
              <Tab.Screen name="SETTING" component={Setting} />
            </Tab.Navigator>
          )}
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
