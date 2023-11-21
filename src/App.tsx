import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Analysis from './screens/Analysis';
import CheckIn from './screens/CheckIn';
import Resource from './screens/Resource';
import MyPage from './screens/MyPage';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="CheckIn"
        screenOptions={() => ({
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Analysis" component={Analysis} />
        <Tab.Screen name="CheckIn" component={CheckIn} />
        <Tab.Screen name="Resource" component={Resource} />
        <Tab.Screen name="MyPage" component={MyPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
