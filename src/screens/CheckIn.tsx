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
import { Colors } from '../utils/colors';
import { ChatbotKey, Conversation, ChatReport } from '../types/checkin';
import LoadingDots from 'react-native-loading-dots';
import { getChatbotMessage } from '../utils/checkin';
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
  const { height, width } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);
  const headerHeight = useHeaderHeight();

  const setNextChatbotMessage = () => {
    const [nextMessage, nextStep] = getChatbotMessage(step, conversation.length, text.trim());
    setIsLoading(true);
    setTimeout(() => {
      setConversation((prev) => [...prev, nextMessage]);
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

  const setStressLevel = async (stress: number) => {
    const finalReport: ChatReport = {
      ...report,
      stress_level: stress,
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
        setConversation((prev) => [
          ...prev,
          {
            id: 'myMessage' + conversation.length,
            isChatbot: false,
            showIcon: stress,
          },
        ]);
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
            // <TouchableOpacity style={styles.icon} onPress={() => setIsVoiceClicked(true)}>
            //   <Image style={{ width: 20, height: 24 }} source={require('../images/voice.png')} />
            // </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setStressLevel(5)}>
            <ThrowUpFaceSvg width="36" height="36" strokeWidth="4" />
            <Text style={styles.emojiText}>Very High</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(4)}>
            <SadFaceSvg width="36" height="36" strokeWidth="4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(3)}>
            <StraightFaceSvg width="36" height="36" strokeWidth="4" />
            <Text style={styles.emojiText}>Moderate</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(2)}>
            <SmileyFaceSvg width="36" height="36" strokeWidth="4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(1)}>
            <HappyFaceSvg width="36" height="36" strokeWidth="4" />
            <Text style={styles.emojiText}>Very Low</Text>
          </TouchableOpacity>
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
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: Colors.secondary,
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});
