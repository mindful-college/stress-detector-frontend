import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignIn from '../screens/SignIn';
import Signup from '../screens/SignUp';
import {Colors} from '../utils/colors';

const Stack = createNativeStackNavigator();

export default function SingInNav(){
    return (
        <Stack.Navigator 
            initialRouteName="SIGNIN"
            screenOptions={{
                headerBackTitleVisible: false,
                headerTintColor: '#000000',
            }}>
            <Stack.Screen name="SIGNIN" component={SignIn} />
            <Stack.Screen name="SIGNUP" component={Signup} />
        </Stack.Navigator>
    )
}