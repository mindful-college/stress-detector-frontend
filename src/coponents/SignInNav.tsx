import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignIn from '../screens/SignIn';
import Signup from '../screens/SignUp';

const Stack = createNativeStackNavigator();

export default function SingInNav(){
    return (
        <Stack.Navigator initialRouteName="SIGNIN" >
              <Stack.Screen name="SIGNIN" component={SignIn} />
              <Stack.Screen name="SIGNUP" component={Signup} />
        </Stack.Navigator>
    )
}