import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useUserContext } from '../context/UserContext';
import { Colors } from '../utils/colors';
import { Dropdown } from 'react-native-element-dropdown';

const Contactus: React.FC<{}> = () => {
  const { dispatch } = useUserContext();

  const items = [
    {
      label: 'Question',
      value: 'Question',
    },
    {
      label: 'Bug Report',
      value: 'Bug Report',
    },
    {
      label: 'Suggestion',
      value: 'Suggestion',
    },
    {
      label: 'Compliment',
      value: 'Compliment',
    },
  ];

  const [value, setValue] = useState('Question');
  const [comment, setComment] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const handleOnPress = () => {
    console.log(value);
    console.log(comment);
  };

  useEffect(() => {
    dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: false });

    return () => dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: true });
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.selectContainer1}>
        <Text style={styles.text}>What do you want to tell us?</Text>
      </View>

      <View style={styles.selectContainer2}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={items}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
          renderItem={renderItem}
        />
      </View>

      <View style={styles.selectContainer3}>
        <Text style={styles.text}>Content</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Write here up to 500 characters..."
          autoCorrect={false}
          autoCapitalize="none"
          multiline={true}
          maxLength={500}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !comment ? styles.disabledButton : null]}
          onPress={handleOnPress}
          disabled={!comment}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  selectContainer1: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  selectContainer2: {
    paddingHorizontal: 5,
  },
  selectContainer3: {
    paddingHorizontal: 20,
    marginTop: 35,
  },
  text: {
    fontSize: 14,
  },
  dropdown: {
    marginTop: 13,
    marginHorizontal: 15,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    elevation: 2,
  },
  item: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputContainer: {
    paddingHorizontal: 22,
    marginTop: 13,
  },
  input: {
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 9,
    borderColor: Colors.lightGrey,
    fontSize: 14,
  },
  buttonContainer: { paddingHorizontal: 22, marginTop: 70 },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  disabledButton: { backgroundColor: Colors.grey, padding: 10, borderRadius: 10 },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});

export default Contactus;
