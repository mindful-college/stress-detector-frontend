import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import ToggleButton from "./ToggleButton";
import {Colors} from '../utils/colors'

export default function Permission(){
    const [permission, setPermission] = useState(["Step Counts", "Sleep Hours", "Heart Rate", "Social Media Usage", "Notification"]);
    const DrawItemWithToggle = (props) => (
        <View style={styles.block}>
          <Text style={styles.item}>{props.item}</Text>
          <ToggleButton/>
        </View>
    )
    return (
        <View>
            <Text style={styles.title}>Permission Setting</Text>
            {permission.map((item)=>(
                <DrawItemWithToggle item={item} key={item}/>
            ))}
        </View>)
}

const styles = StyleSheet.create({
    block: {
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: '5%',
      paddingVertical: '2%',
      backgroundColor: Colors.white,
      justifyContent: 'space-between',
      borderTopColor: Colors.grey,
      borderTopWidth: 0.5,
      borderBottomColor: Colors.grey,
      borderBottomWidth: 0.5,
    },
    title:{
      fontSize:20,
      color:Colors.black,
      paddingTop: 20,
      paddingBottom: 10,
      marginHorizontal: '5%',
    },
    item:{
      fontSize:16,
      color:Colors.black,
      marginVertical: 5,
    },
  });