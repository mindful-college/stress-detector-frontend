import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Setting from '../screens/Setting';
import Contactus from "../screens/ContactUs";
import TermsOfUse from "../screens/TermsOfUse";
import Policy from "../screens/Policy";
import {Colors} from "../utils/colors";
const Stack = createNativeStackNavigator();

export default function SettingNav(){
    return (
        <Stack.Navigator 
            initialRouteName="Setting"
            screenOptions={{
                headerBackTitleVisible: false,
                headerTintColor: Colors.black,
        }}>
            <Stack.Screen name="Setting" component={Setting} options={{title:"SETTING"}}/>
            <Stack.Screen name="CONTACTUS" component={Contactus}/>
            <Stack.Screen name="TERMSOFUSE" component={TermsOfUse}/>
            <Stack.Screen name="POLICY" component={Policy}/>
        </Stack.Navigator>
    );
}