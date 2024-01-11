import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { Colors } from '../utils/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { useMutation } from '@tanstack/react-query';
import { submitContactUsForm } from '../utils/userService';
import Toast from 'react-native-toast-message';
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
      // label: '1',
      value: 'Question',
    },
    {
      // label: 'Bug Report',
      value: 'Bug Report',
    },
    {
      // label: 'Suggestion',
      value: 'Suggestion',
    },
    {
      // label: 'Compliment',
      value: 'Compliment',
    },
  ];

  const [value, setValue] = useState('Question');
  const [comment, setComment] = useState('');

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.value}</Text>
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
    Toast.show({
      type: 'success',
      text1: 'Message successfully sent to the admin.',
    });
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
      <ModalHeader title="CONTACT US" onClose={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={30}>
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
              labelField="value"
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
        </SafeAreaView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !comment ? styles.disabledButton : null]}
          onPress={handleOnPress}
          disabled={!comment}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'flex-end',
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
  keyboardAvoidingView: {
    flex: 1,
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
    paddingBottom: 8,
    paddingHorizontal: 9,
    borderColor: Colors.lightGrey,
    fontSize: 14,
  },
  buttonContainer: { paddingHorizontal: 22, marginTop: 70, marginBottom: 35 },
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