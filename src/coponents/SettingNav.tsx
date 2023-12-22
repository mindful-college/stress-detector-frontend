import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Setting from '../screens/Setting';
import Contactus from "../screens/ContactUs";
import TermsOfUse from "../screens/TermsOfUse";
import Policy from "../screens/Policy";

const Stack = createNativeStackNavigator();

export default function SettingNav(){
    return (
        <Stack.Navigator initialRouteName="SETTING">
              <Stack.Screen name="SETTING" component={Setting} />
              <Stack.Screen name="CONTACTUS" component={Contactus}/>
              <Stack.Screen name="TERMSOFUSE" component={TermsOfUse}/>
              <Stack.Screen name="POLICY" component={Policy}/>
        </Stack.Navigator>
    );
}