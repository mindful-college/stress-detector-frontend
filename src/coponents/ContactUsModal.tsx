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
  Dimensions,
} from 'react-native';
import { Colors } from '../utils/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import ModalHeader from './ModalHeader';
import { submitContactUsForm } from '../utils/userService';
import { horizontalScale, moderateScale, verticalScale } from '../themes/metrics';

type ContactUsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  userToken: string | undefined;
  userEmail: string | undefined;
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

  type DropdownItem = {
    value: string;
  };

  const items = [
    {
      value: 'Question',
    },
    {
      value: 'Bug Report',
    },
    {
      value: 'Suggestion',
    },
    {
      value: 'Compliment',
    },
  ];

  const [value, setValue] = useState('Question');
  const [comment, setComment] = useState('');

  const renderItem = (item: DropdownItem) => {
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
        keyboardVerticalOffset={10}>
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'flex-end',
  },
  selectContainer1: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
  },
  selectContainer2: {
    paddingHorizontal: horizontalScale(5),
  },
  selectContainer3: {
    paddingHorizontal: horizontalScale(20),
    // marginTop: windowWidth >= 430 ? 80 : windowWidth < 376 ? (windowHeight > 800 ? 70 : 35) : 80,
    marginTop: verticalScale(80),
  },
  text: {
    fontSize: moderateScale(14),
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  dropdown: {
    marginTop: verticalScale(13),
    marginHorizontal: horizontalScale(15),
    height: verticalScale(45),
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    elevation: 2,
  },
  item: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: moderateScale(14),
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
  },
  iconStyle: {
    width: horizontalScale(30),
    height: verticalScale(30),
  },
  inputContainer: {
    paddingHorizontal: horizontalScale(22),
    marginTop: verticalScale(13),
    marginBottom: verticalScale(17),
  },
  input: {
    // height: windowWidth >= 430 ? 400 : windowWidth < 376 ? (windowHeight > 800 ? 360 : 300) : 330,
    height: verticalScale(320),
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(8),
    paddingHorizontal: horizontalScale(9),
    borderColor: Colors.lightGrey,
    fontSize: moderateScale(14),
  },
  buttonContainer: {
    paddingHorizontal: horizontalScale(22),
    marginTop: verticalScale(70),
    // marginBottom: windowWidth >= 430 ? 65 : windowWidth < 376 ? 35 : 55,
    marginBottom: verticalScale(50),
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: 10,
  },
  disabledButton: { backgroundColor: Colors.grey, padding: 10, borderRadius: 10 },
  buttonText: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});

export default ContactUsModal;
