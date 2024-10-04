import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomButton from '../coponents/CustomButton';
import { Colors } from '../utils/colors';
import { ChatbotKey, Conversation, ChatReport } from '../types/checkin';
import LoadingDots from 'react-native-loading-dots';
import { getChatbotMessage, QUESTIONS } from '../utils/checkin';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';
import SadFaceSvg from '../svg/SadFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import HappyFaceSvg from '../svg/HappyFaceSvg';
import ChatBox from '../coponents/ChatBox';
import { useHeaderHeight } from '@react-navigation/elements';
import AudioRecording from '../coponents/AudioRecording';
import axios from 'axios';
import { REPORT_URL } from '../utils/api';
import Toast from 'react-native-toast-message';
import { useUserContext } from '../context/UserContext';
import LoadingIndicator from '../coponents/LoadingIndicator';

const DEFAULT_REPORT = {
  text: [],
  voice: [],
  stress_level: null,
};

export default function CheckIn() {
  const { state, dispatch } = useUserContext();
  const [text, setText] = useState('');
  const [isVoiceClicked, setIsVoiceClicked] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [step, setStep] = useState<ChatbotKey>('init');
  const [isLoading, setIsLoading] = useState(false);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [report, setReport] = useState<ChatReport>(DEFAULT_REPORT);
  const [stressLevel, setStressLevel] = useState<null | number>(null);

  const { height, width } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);
  const headerHeight = useHeaderHeight();

  const setNextChatbotMessage = () => {
    const [nextMessage, nextStep] = getChatbotMessage(step, conversation.length, text.trim());
    setIsLoading(true);
    setTimeout(() => {
      if (nextMessage !== null) setConversation((prev) => [...prev, nextMessage]);
      setStep(nextStep);
      setIsLoading(false);
    }, 1000);
  };

  const appendReport = () => {
    const trimedText = text.trim();
    // if (trimedText.toLocaleLowerCase() === 'skip') return;
    if (step === 'restart') {
      setReport(DEFAULT_REPORT);
    }

    setReport((prev) => ({
      ...prev,
      text: [...prev.text, trimedText],
    }));
  };

  const sendMessage = () => {
    setConversation((prev) => [
      ...prev,
      {
        id: 'myMessage' + conversation.length,
        isChatbot: false,
        text: text,
      },
    ]);
    if (text.trim().toLowerCase() !== 'done') appendReport();
    setText('');
    setNextChatbotMessage();
  };

  useEffect(() => {
    setNextChatbotMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 'stressLevel') {
      Keyboard.dismiss();
    }
  }, [step]);

  const cancelReport = () => {
    setStep('restart');
    setConversation((prev) => [
      ...prev,
      {
        id: 'restart' + conversation.length,
        isChatbot: true,
        text: QUESTIONS.restart,
      },
    ]);
  };

  const sendReport = async () => {
    const date = new Date();
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    const finalReport: ChatReport = {
      ...report,
      stress_level: stressLevel,
      date: localDate,
    };
    try {
      setIsReportSubmitted(true);
      setStep('init');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user?.access_token}`,
      };
      const { status } = await axios.post(REPORT_URL, finalReport, { headers });
      if (status === 200) {
        setReport(DEFAULT_REPORT);
        setNextChatbotMessage();
        dispatch({ type: 'UPDATE_POINTS', payload: (state.user?.points ?? 0) + 100 });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Please restart the conversation.',
      });
    } finally {
      setIsReportSubmitted(false);
    }
  };

  const handleAudio = (file) => {
    setReport((prev) => ({
      ...prev,
      voice: [...prev.voice, file],
    }));
    setConversation((prev) => [
      ...prev,
      {
        id: 'myMessage' + conversation.length,
        isChatbot: false,
        text: 'sent voice file',
      },
    ]);
    setNextChatbotMessage();
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight + 50}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          }}
          style={{ maxHeight: height - 60 }}>
          {conversation.map((chat) => (
            <View key={chat.id}>
              <ChatBox chat={chat} />
            </View>
          ))}
          {isLoading && (
            <View style={{ width: 80, marginBottom: 16 }}>
              <LoadingDots bounceHeight={10} size={12} />
            </View>
          )}
        </ScrollView>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Write here..."
            value={text}
            onChangeText={setText}
            multiline={true}
          />
          {text !== '' ? (
            <TouchableOpacity style={styles.icon} onPress={sendMessage}>
              <Image
                style={{ width: 24, height: 24 }}
                source={require('../images/send-active.png')}
              />
            </TouchableOpacity>
          ) : (
            <Image
              style={(styles.icon, { marginLeft: 10, width: 24, height: 24 })}
              source={require('../images/send-empty.png')}
            />
          )}
          <AudioRecording
            handleAudio={handleAudio}
            isVoiceClicked={isVoiceClicked}
            setIsVoiceClicked={setIsVoiceClicked}
          />
        </View>
      </KeyboardAvoidingView>
      <LoadingIndicator isLoading={isReportSubmitted} color={Colors.black} />
      <Modal
        style={{ flex: 1 }}
        visible={step === 'stressLevel' && !isReportSubmitted}
        animationType="slide"
        transparent={true}>
        <View style={[styles.modalContainer, { width: width }]}>
          <View>
            <Text style={{ fontSize: 20, marginTop: 20 }}>
              Please select your self-reported stress level
            </Text>
            <Text style={{ fontSize: 12, color: '#444444', marginBottom: 12 }}>
              This will help us to predict your stress level
            </Text>
          </View>
          <View style={styles.stressIconWrapper}>
            <TouchableOpacity onPress={() => setStressLevel(5)}>
              <ThrowUpFaceSvg
                width="36"
                height="36"
                strokeWidth="4"
                color={stressLevel === 5 ? Colors.primary : '#4B4B4B'}
              />
              <Text style={styles.emojiText}>Very High</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStressLevel(4)}>
              <SadFaceSvg
                width="36"
                height="36"
                strokeWidth="4"
                color={stressLevel === 4 ? Colors.primary : '#4B4B4B'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStressLevel(3)}>
              <StraightFaceSvg
                width="36"
                height="36"
                strokeWidth="4"
                color={stressLevel === 3 ? Colors.primary : '#4B4B4B'}
              />
              <Text style={styles.emojiText}>Moderate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStressLevel(2)}>
              <SmileyFaceSvg
                width="36"
                height="36"
                strokeWidth="4"
                color={stressLevel === 2 ? Colors.primary : '#4B4B4B'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStressLevel(1)}>
              <HappyFaceSvg
                width="36"
                height="36"
                strokeWidth="4"
                color={stressLevel === 1 ? Colors.primary : '#4B4B4B'}
              />
              <Text style={styles.emojiText}>Very Low</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
            }}>
            <CustomButton
              color={Colors.primary}
              backgroundColor={Colors.white}
              title="Cancel"
              onPress={cancelReport}
              style={{ flexGrow: 1, borderColor: Colors.primary, borderWidth: 2 }}
            />
            <CustomButton
              color={Colors.white}
              backgroundColor={Colors.primary}
              title="Submit"
              onPress={sendReport}
              disabled={stressLevel === null}
              style={{ flexGrow: 1 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  inputWrapper: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: Colors.grey,
    borderWidth: 1,
    padding: 8,
    minHeight: 40,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
    width: 20,
    height: 24,
    zIndex: 100,
  },
  modalContainer: {
    position: 'absolute',
    display: 'flex',
    gap: 10,
    height: '50%',
    borderColor: Colors.primary,
    borderWidth: 2,
    bottom: 0,
    backgroundColor: Colors.white,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'scroll',
  },
  stressIconWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emoji: {
    width: 28,
    height: 28,
  },
  emojiText: {
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
  },
  hourContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hourButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
    padding: 4,
    borderRadius: 4,
  },
});
