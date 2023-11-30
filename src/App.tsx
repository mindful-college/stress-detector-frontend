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

const Tab = createBottomTabNavigator();

export default function App() {
  const [state, dispatch] = useReducer(userReducer, initialUser);
  const contextValue = { state, dispatch };
  console.log(state);
  useEffect(() => {
    const checkToken = async () => {
      const user = await AsyncStorage.getItem('user');
      console.log(user);
      if (user) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
      }
    };
    checkToken();
  }, []);

  return (
    <UserContext.Provider value={contextValue}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="CheckIn"
          screenOptions={() => ({
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          {!state.user ? (
            <Tab.Screen name="SignIn" component={SignIn} />
          ) : (
            <>
              <Tab.Screen name="CheckIn" component={CheckIn} />
              <Tab.Screen name="Analysis" component={Analysis} />
              <Tab.Screen name="Resource" component={Resource} />
              <Tab.Screen name="MyDay" component={MyDay} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
