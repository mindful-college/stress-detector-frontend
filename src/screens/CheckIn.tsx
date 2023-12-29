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
} from 'react-native';
import { Colors } from '../utils/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ChatbotKey, Conversation, Report } from '../types/checkin';
import LoadingDots from 'react-native-loading-dots';
import { getChatbotMessage } from '../utils/checkin';

export default function CheckIn() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(null);
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

  const renderChatBox = (chat: Conversation) => {
    if (chat.isChatbot) {
      return (
        <View key={chat.id} style={styles.leftBox}>
          <Text>{chat.text}</Text>
        </View>
      );
    }

    if (chat.text) {
      return (
        <View key={chat.id} style={styles.rightBox}>
          <Text>{chat.text}</Text>
        </View>
      );
    }

    if (chat.audio) {
      return (
        <View key={chat.id} style={styles.rightBox}>
          <Text>Audio</Text>
        </View>
      );
    }

    if (chat.showIcon) {
      switch (chat.showIcon) {
        case 5:
          return (
            <View key={chat.id} style={styles.rightBox}>
              <Image style={styles.emoji} source={require('../images/throw-up-face.png')} />
            </View>
          );
        case 4:
          return (
            <View key={chat.id} style={styles.rightBox}>
              <Image style={styles.emoji} source={require('../images/sad-face.png')} />
            </View>
          );
        case 3:
          return (
            <View key={chat.id} style={styles.rightBox}>
              <Image style={styles.emoji} source={require('../images/straight-face.png')} />
            </View>
          );
        case 2:
          return (
            <View key={chat.id} style={styles.rightBox}>
              <Image style={styles.emoji} source={require('../images/smiley-face.png')} />
            </View>
          );
        case 1:
          return (
            <View key={chat.id} style={styles.rightBox}>
              <Image style={styles.emoji} source={require('../images/happy-face.png')} />
            </View>
          );
      }
    }
  };

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
    console.log(step, text);
    appendReport();
    setText('');
    setNextChatbotMessage();
  };

  useEffect(() => {
    setNextChatbotMessage();
  }, []);

  useEffect(() => {
    if (step === 'stress_level') {
      Keyboard.dismiss();
      console.log(report);
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
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        extraScrollHeight={40}
        scrollEnabled={false}
        style={[styles.container]}
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          }}
          style={{ maxHeight: height - 60 }}>
          {conversation.map((chat) => renderChatBox(chat))}
          {isLoading && (
            <View style={{ width: 80, marginBottom: 16 }}>
              <LoadingDots bounceHeight={10} size={12} />
            </View>
          )}
        </ScrollView>
        <View style={[styles.inputWrapper]}>
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
            <Image style={styles.icon} source={require('../images/voice.png')} />
          )}
        </View>
      </KeyboardAwareScrollView>
      <Modal
        style={{ flex: 1 }}
        visible={step === 'stress_level'}
        animationType="slide"
        transparent={true}>
        <View style={[styles.modalContainer, { width: width }]}>
          <TouchableOpacity onPress={() => setStressLevel(5)}>
            <Image style={styles.emoji} source={require('../images/throw-up-face.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(4)}>
            <Image style={styles.emoji} source={require('../images/sad-face.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(3)}>
            <Image style={styles.emoji} source={require('../images/straight-face.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(2)}>
            <Image style={styles.emoji} source={require('../images/smiley-face.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStressLevel(1)}>
            <Image style={styles.emoji} source={require('../images/happy-face.png')} />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  leftBox: {
    backgroundColor: Colors.grey,
    padding: 20,
    marginBottom: 16,
    width: 240,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
  },
  rightBox: {
    backgroundColor: Colors.secondary,
    padding: 16,
    marginBottom: 16,
    width: 240,
    alignSelf: 'flex-end',
    borderRadius: 12,
    borderBottomRightRadius: 0,
  },
  inputWrapper: {
    marginTop: 20,
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
});
