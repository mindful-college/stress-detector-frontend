import React, { useEffect, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Analysis from './screens/Analysis';
import CheckIn from './screens/CheckIn';
import Resource from './screens/Resource';
import MyDay from './screens/MyDay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignIn from './screens/SignIn';
import { UserContext, initialUser, userReducer } from './context/UserContext';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StyleSheet } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      <UserContext.Provider value={contextValue}>
        <NavigationContainer>
          {!state.user ? (
            <Tab.Navigator
              initialRouteName="SignIn"
              screenOptions={() => ({
                tabBarStyle: {
                  display: 'none',
                },
              })}>
              <Tab.Screen name="SignIn" component={SignIn} />
              <Tab.Screen name="SignUp" component={Signup} />
            </Tab.Navigator>
          ) : (
            <Tab.Navigator
              initialRouteName="CheckIn"
              screenOptions={() => ({
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
              })}>
              <Tab.Screen name="CheckIn" component={CheckIn} />
              <Tab.Screen name="Analysis" component={Analysis} />
              <Tab.Screen name="Resource" component={Resource} />
              <Tab.Screen name="MyDay" component={MyDay} />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </UserContext.Provider>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
