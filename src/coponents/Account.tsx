import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import {Colors} from '../utils/colors';
import { useUserContext } from '../context/UserContext';
import { USER_INFO_URL } from "../utils/api";
// import InputWithLabel from "./InputWithLabel";
import axios from 'axios';

export default function Account(){
    const [userInfo, setUserInfo] = useState({
        username: "",
        points: "1000"
    });

    const [user, setUser] = useState("")
    const { state, dispatch } = useUserContext();
    useEffect(() => {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user?.access_token}`,
        };
      
        const account = async () => {
          try {
            const res = await axios.get(USER_INFO_URL, { headers });
      
            if (res.status === 200) {
                const updatedUserInfo = {
                    ...userInfo,
                    username: res.data.username
                }
                setUserInfo(updatedUserInfo)
            }
          } catch (error) {
            // Handle errors if the request fails
            console.error(error);
          }
        };
      
        // Call the account function here to trigger the API request
        account();
      }, [state.user?.access_token]);
   
    const [isEnabled, setIsEnabled] = useState(false);
    
    const handleName = (name) => {
        setUser(name);
      };

    const handleEdit = () => {
        setIsEnabled(!isEnabled)
    }

    return(
        <View>
            <Text style={styles.title}>Account</Text>
            <View style={styles.block}>
                {isEnabled?<TextInput
                        style={styles.item}
                        placeholder="name"
                        value={user}
                        onChangeText={handleName}
                    /> : 
                    <Text style={styles.item}>{userInfo.username}</Text>}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEdit}>
                    <Text style={styles.buttonText}>{isEnabled? "Save":"Edit"}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <Text style={styles.item}>{userInfo.points} Points</Text>
            </View>

        </View>
    )
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
    container: {
      flex: 1,
      // backgroundColor:Colors.grey,
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
    button:{
      transform:[
          {scaleX:0.8},
          {scaleY:0.8}],
      fontSize:16,
      color:Colors.black,
    },
    buttonText:{
      fontSize:18,
      color:Colors.primary,
    }
  });