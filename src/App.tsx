import React, { useEffect, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext, initialUser, userReducer } from './context/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from './utils/colors';

import SignInNav from './coponents/SignInNav';
import CheckInNav from './coponents/CheckInNav';

const Stack = createNativeStackNavigator();

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
    <UserContext.Provider value={contextValue}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            {!state.user ? (
              <Stack.Screen name="SIGNINNAV" component={SignInNav} options={{headerShown:false}}/>
            ) : (
              <Stack.Screen name="MAIN" component={CheckInNav} options={{headerShown: false}}/>
            )}
          </Stack.Navigator>
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
});
