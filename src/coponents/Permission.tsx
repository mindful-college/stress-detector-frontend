import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import ToggleButton from "./ToggleButton";
import {Colors} from '../utils/colors'
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import {PERMISSION_URL} from '../utils/api'
export default function Permission(){
    const [permission, setPermission] = useState(["Step Count", "Sleep Hours", "Heart Rate", "Notification"]);
    const [enabled, setEnabled] = useState({})
    const { state, dispatch } = useUserContext();
    useEffect(()=>{
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.user?.access_token}`,
          };
        
          const permission = async () => {
            try {
              const res = await axios.get(PERMISSION_URL, { headers });
                
              if (res.status === 200) {
                  setEnabled(res.data)
              }
            } catch (error) {
              // Handle errors if the request fails
              console.error(error);
            }
          };
        
          // Call the account function here to trigger the API request
          permission();
        }, [state.user?.access_token]);
    const DrawItemWithToggle = (props) => (
        <View style={styles.block}>
          <Text style={styles.item}>{props.item}</Text>
          <ToggleButton item={props.item} isAllowed={enabled[props.item]}/>
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