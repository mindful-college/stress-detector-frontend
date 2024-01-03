import React, {useState,useEffect} from 'react';
import {Alert, View, Switch, StyleSheet, Modal, Text, Pressable, Linking, AppState} from 'react-native';
import { Colors } from '../utils/colors';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import {PERMISSION_URL} from '../utils/api'
import {checkNotifications, openSettings, requestNotifications} from 'react-native-permissions';
import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';




export default function ToggleButton(props){
  //Bool for toggle button
  const [isToggleEnabled, setIsToggleEnabled] = useState(props.isAllowed);
  //Bool for modal screen
  const [modalVisible, setModalVisible] = useState(false);
  //userinfo in Reducer
  const { state, dispatch } = useUserContext();
  //Bool fordevice setting permission
  const [permission,setPermission] = useState(false);

  // To update health data access
  // const permissions = {
  //   "Heart Rate": {permissions: {
  //     read: [AppleHealthKit.Constants.Permissions.HeartRate ],
  //     write: [],
  //     }}as HealthKitPermissions,
    
  //   "Step Count": {permissions: {
  //     read: [AppleHealthKit.Constants.Permissions.StepCount ],
  //     write: [],
  //   }}as HealthKitPermissions,
  
  //   "Sleep Hours": {permissions: {
  //     read: [AppleHealthKit.Constants.Permissions.SleepAnalysis ],
  //     write: [],
  //     }}as HealthKitPermissions
  // } 

  // AppleHealthKit.initHealthKit(permissions[props.item], (error: string) => {
  //   /* Called after we receive a response from the system */
  
  //   if (error) {
  //     console.log(error)
  //     setIsToggleEnabled(false);
  //     updatePermission(false);
  //     setPermission(false);
  //   }

  //   const options = {
  //     startDate: new Date(2020, 1, 1).toISOString(),
  //   }
  
  //   AppleHealthKit.getHeartRateSamples(
  //     options,
  //     (callbackError: string, results: HealthValue[]) => {
  //       console.log(callbackError)
  //       console.log(results)
  //       /* Samples are now collected from HealthKit */
  //     },
  //   )
  // })

  //Link to mobile setting page
  const toSetting = () => {
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
    });
    openSettings().catch(() => console.warn('cannot open settings'));
    // Linking.openSettings();
    setModalVisible(false);
  }

  // Send API Request to update permission 
  const updatePermission = async (newPermission) => {
    // Header for API call
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user?.access_token}`,
    };
    //Text justification for API call
    const permission_type = props.item.toLowerCase().replaceAll(" ", "_")
    try {
        const res = await axios.put(`${PERMISSION_URL}?permission_type=${permission_type}&permission=${newPermission}`, {} ,{ headers });
        // check response to set Permission
        if(res.status === 200){
          setIsToggleEnabled(newPermission);
        }
    //Handle error
    }catch(err){
        console.error(err);
    }
  }

  // check Mobile setting permission 
  const checkNotificationPermission = props.item === 'Notification'? 
    async () => {
      //get mobile setting notification permission
      await checkNotifications()
      .then((status) => {
        //set mobile setting permission in permission
        setPermission(status["status"] === "granted");
        //Handle if it is denied
        if(status["status"] !== "granted"){
          //Turn off the switch button
          setIsToggleEnabled(false);
          //Set false in server data
          updatePermission(false);
        }
      })
      //error handle for getting mobile setting permission
      .catch((error) => console.log('checkNotifications', error));
    }: async ()=>{
      // Implement Health Permission
      
      setPermission(true);
    }

  useEffect(()=>{
    //To set initial data
    checkNotificationPermission();
    //To handle permission after mobile setting changed
    const listener = AppState.addEventListener('change', checkNotificationPermission);
    return () =>{
      listener.remove();
    };
  });

  //To handle switch toggle button
  const toggleSwitch = async() => {
    if(!permission){
      setModalVisible(true);
    }else{
      updatePermission(!isToggleEnabled);
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Turn on Notification to Allow "Stress Detect" to send alerts</Text>
            <View style={styles.modalButton}>
              <Pressable
                style={[styles.buttonLeft]}
                onPress={toSetting}>
                <Text style={styles.textStyle}>Settings</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonRight]}
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Switch
        trackColor={{true: Colors.primary}}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.grey}
        onValueChange={toggleSwitch}
        value={isToggleEnabled}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform:[
      {scaleX:0.8},
      {scaleY:0.8}],
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    display:'flex',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRight: {
    padding: 10,
    elevation: 2,
    width: '50%',
    borderLefttColor: Colors.grey,
    borderLeftWidth: 0.2,
  },
  buttonLeft: {
    padding: 10,
    elevation: 2,
    width: '50%',
    borderRighttColor: Colors.grey,
    borderRightWidth: 0.3,
  },  
  textStyle: {
    color: Colors.primary,
    textAlign: 'center',
  },
  modalText: {
    padding:35,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton:{
    display: 'flex',
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor:Colors.grey,
  },
});
