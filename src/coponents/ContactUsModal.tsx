import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Colors } from '../utils/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { useMutation } from '@tanstack/react-query';
import { submitContactUsForm } from '../utils/userService';
import ModalHeader from './ModalHeader';

type ContactUsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  userToken: string;
  userEmail: string;
};

const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isVisible,
  onClose,
  userToken,
  userEmail,
}) => {
  type FormData = {
    email: string | undefined;
    support_type: string;
    message: string;
  };

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

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const submitFormMutation = useMutation({
    mutationFn: (formData: FormData) => submitContactUsForm(userToken, formData),
    onSuccess: () => {
      console.log('Form submitted successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Error submitting form: ', error);
    },
  });

  const handleOnPress = () => {
    const formData: FormData = {
      email: userEmail,
      support_type: value,
      message: comment,
    };
    submitFormMutation.mutate(formData);
    setComment('');
    setValue('Question');
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeContainer}>
        <ModalHeader title="CONTACT US" onClose={onClose} />

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
    </Modal>
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

export default ContactUsModal;
