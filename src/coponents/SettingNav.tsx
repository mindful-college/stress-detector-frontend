import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Setting from '../screens/Setting';
import Contactus from '../screens/ContactUs';
import TermsOfUse from '../screens/TermsOfUse';
import Policy from '../screens/Policy';
import { Colors } from '../utils/colors';

const Stack = createNativeStackNavigator();


export default function SettingNav() {
  return (
    <Stack.Navigator
      initialRouteName="SETTINGNAV"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: Colors.header_black,
      }}>
      <Stack.Screen name="Setting" component={Setting} options={{ title: 'SETTING' }} />
      <Stack.Screen name="CONTACTUS" component={Contactus} options={{ title: 'CONTACT US' }} />
      <Stack.Screen name="TERMSOFUSE" component={TermsOfUse} options={{ title: 'Terms of Use' }} />
      <Stack.Screen name="POLICY" component={Policy} options={{ title: 'Privacy Policy' }} />
    </Stack.Navigator>
  );
}

