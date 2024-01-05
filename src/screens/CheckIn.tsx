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
import { ChatbotKey, Conversation, Report } from '../types/checkin';
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

export default function CheckIn() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(null);
  const [isVoiceClicked, setIsVoiceClicked] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [step, setStep] = useState<ChatbotKey>('init');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report>({
    text: [],
    voice: [],
    study_hours: null,
    work_hours: null,
    stress_level: null,
  });
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
    if (trimedText.toLocaleLowerCase() === 'skip') return;

    if (step === 'restart') {
      setReport({
        text: [],
        voice: [],
        study_hours: null,
        work_hours: null,
        stress_level: null,
      });
    }

    if (voice) {
      setReport((prev) => ({
        ...prev,
        voice: [...prev.voice, voice],
      }));
      return;
    }

    if (
      step === 'study_hours' ||
      step === 'studyError' ||
      step === 'work_hours' ||
      step === 'workError'
    ) {
      if (isNaN(Number(trimedText))) return;

      if (step === 'study_hours' || step === 'studyError') {
        setReport((prev) => ({
          ...prev,
          study_hours: Number(trimedText),
        }));
      }

      if (step === 'work_hours' || step === 'workError') {
        setReport((prev) => ({
          ...prev,
          work_hours: Number(trimedText),
        }));
      }
      return;
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
    appendReport();
    setText('');
    setNextChatbotMessage();
  };

  useEffect(() => {
    setNextChatbotMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 'stress_level') {
      Keyboard.dismiss();
    }
  }, [step]);

  const setStressLevel = (stress: number) => {
    // todo : call api
    console.log(report);
    const finalReport = {
      ...report,
      stress_level: stress,
    };
    console.log(finalReport);
    setConversation((prev) => [
      ...prev,
      {
        id: 'myMessage' + conversation.length,
        isChatbot: false,
        showIcon: stress,
      },
    ]);
    setReport({
      text: [],
      voice: [],
      study_hours: null,
      work_hours: null,
      stress_level: null,
    });
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
            <TouchableOpacity style={styles.icon} onPress={() => setIsVoiceClicked(true)}>
              <Image style={{ width: 20, height: 24 }} source={require('../images/voice.png')} />
            </TouchableOpacity>
          )}
          <AudioRecording
            setVoice={setVoice}
            isVoiceClicked={isVoiceClicked}
            setIsVoiceClicked={setIsVoiceClicked}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal
        style={{ flex: 1 }}
        visible={step === 'stress_level'}
        animationType="slide"
        transparent={true}>
        <View style={[styles.modalContainer, { width: width }]}>
          <TouchableOpacity onPress={() => setStressLevel(5)}>
            <ThrowUpFaceSvg width="36" height="36" strokeWidth="4" />
            <Text style={styles.emojiText}>BAD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(4)}>
            <SadFaceSvg width="36" height="36" strokeWidth="4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(3)}>
            <StraightFaceSvg width="36" height="36" strokeWidth="4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(2)}>
            <SmileyFaceSvg width="36" height="36" strokeWidth="4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(1)}>
            <HappyFaceSvg width="36" height="36" strokeWidth="4" />
            <Text style={styles.emojiText}>GOOD</Text>
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
  emojiText: { marginTop: 8, fontSize: 10, textAlign: 'center' },
});
