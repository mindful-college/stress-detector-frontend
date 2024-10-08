import React, { useEffect, useReducer, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext, initialUser, userReducer } from './context/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StyleSheet, AppState } from 'react-native';
import { Colors } from './utils/colors';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import SignInNav from './coponents/SignInNav';
import CheckInNav from './coponents/CheckInNav';
import axios from 'axios';
import { GET_USER_DATA_AVERAGE_URL, PERMISSION_URL } from './utils/api';
import moment from 'moment';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(userReducer, initialUser);
  const contextValue = { state, dispatch };
  const queryClient = new QueryClient();
  const appState = useRef(AppState.currentState);

  const getPermission = async (accessToken) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const res = await axios.get(PERMISSION_URL, { headers });
      if (res.status === 200) {
        dispatch({ type: 'SET_PERMISSION', payload: res.data });
      }
    } catch (error) {
      // Handle errors if the request fails
      console.error(error);
    }
  };

  const getReportAverage = async (accessToken) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const res = await axios.get(GET_USER_DATA_AVERAGE_URL, { headers });
      if (res.status === 200 && res.data) {
        dispatch({ type: 'SET_AVERAGE_REPORT_DATA', payload: res.data });
      }
    } catch (error) {
      // Handle errors if the request fails
      console.error(error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        dispatch({ type: 'SET_USER', payload: parsedUser });
        if (parsedUser.access_token) {
          getPermission(parsedUser.access_token);
          getReportAverage(parsedUser.access_token);
        }
      }
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      appState.current = nextAppState;
      if (appState.current === 'active') {
        const lastDailyCheckInDate = await AsyncStorage.getItem('lastDailyCheckInDate');
        const today = moment();
        if (lastDailyCheckInDate && today.hours() >= 21) {
          const parsedCheckInDate = moment(lastDailyCheckInDate);
          if (
            parsedCheckInDate.month() !== today.month() ||
            parsedCheckInDate.date() !== today.date()
          ) {
            await getReportAverage(state.user?.access_token);
            // dispatch({ type: 'UPDATE_DAILY_CHECKIN_MODAL', payload: true });
          }
        }
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={contextValue}>
      <SafeAreaView style={styles.container}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator>
              {!state.user ? (
                <Stack.Screen
                  name="SIGNINNAV"
                  component={SignInNav}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen name="MAIN" component={CheckInNav} options={{ headerShown: false }} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
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
});
