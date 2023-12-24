import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUserContext } from '../context/UserContext';
import { Colors } from '../utils/colors';
import { Dropdown } from 'react-native-element-dropdown';

const Contactus: React.FC<{}> = () => {
  const { dispatch } = useUserContext();

  const items = [
    {
      label: 'Question',
      value: '1',
    },
    {
      label: 'Bug Report',
      value: '2',
    },
    {
      label: 'Suggestion',
      value: '3',
    },
    {
      label: 'Compliment',
      value: '4',
    },
  ];

  const [value, setValue] = useState('1');

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  useEffect(() => {
    dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: false });

    return () => dispatch({ type: 'SET_TAB_BAR_VISIBILITY', payload: true });
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.selectContainer1}>
        <Text style={styles.textForSelectSection}>What do you want to tell us?</Text>
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
    paddingTop: 5,
  },
  textForSelectSection: {
    fontSize: 15,
  },
  dropdown: {
    margin: 15,
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
    fontSize: 15,
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
});

export default Contactus;
