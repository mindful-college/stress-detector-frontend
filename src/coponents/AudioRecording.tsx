import React, { useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import type { AudioSet, PlayBackType, RecordBackType } from 'react-native-audio-recorder-player';
import { Colors } from '../utils/colors';
import RNFetchBlob from 'rn-fetch-blob';

type AudioRecordingProps = {
  setVoice: any;
  isVoiceClicked: boolean;
  setIsVoiceClicked: any;
};

export default function AudioRecording({
  setVoice,
  isVoiceClicked,
  setIsVoiceClicked,
}: AudioRecordingProps) {
  const { width } = Dimensions.get('window');
  const [recordStep, setRecordStep] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [isRecordPlaying, setIsRecordPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState('');
  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.1);
  const path = `checkin${new Date().getTime()}.m4a`;

  const onStartRecord = async (): Promise<void> => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const file = await audioRecorderPlayer.startRecorder(path, audioSet);
    setAudioFile(file);
    console.log(file);
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setRecordStep(1);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
  };

  const onPauseRecord = async (): Promise<void> => {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setRecordStep(2);
    } catch (err) {
      console.log('pauseRecord', err);
    }
  };

  const onStopRecord = async (): Promise<void> => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordStep(0);
  };

  const onStartPlay = async (): Promise<void> => {
    try {
      await audioRecorderPlayer.startPlayer(path);
      await audioRecorderPlayer.setVolume(1.0);
      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
        }
        setIsRecordPlaying(true);
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };

  const onStopPlay = async (): Promise<void> => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsRecordPlaying(false);
  };

  const sendAudio = async () => {
    const filename = audioFile.replace('file:', '');
    const audioBlob = await RNFetchBlob.fs.readFile(filename, 'base64');
    setVoice(audioBlob);
    closeAudio();
  };

  const resetRecording = async () => {
    await onStopRecord();
    await onStartRecord();
  };

  const closeAudio = async () => {
    await onPauseRecord();
    await onStopRecord();
    setRecordStep(0);
    setIsVoiceClicked(false);
  };

  return (
    <Modal style={styles.modal} visible={isVoiceClicked} animationType="slide" transparent={true}>
      <View style={[styles.modalContainer, { width: width }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={closeAudio}>
            <Image source={require('../images/close.png')} />
          </TouchableOpacity>
        </View>
        {recordStep === 0 && (
          <TouchableOpacity style={styles.audioWrapper} onPress={onStartRecord}>
            <Image style={styles.audioIcon} source={require('../images/audio-blue.png')} />
          </TouchableOpacity>
        )}
        {recordStep === 1 && (
          <>
            <TouchableOpacity style={styles.audioWrapper} onPress={onPauseRecord}>
              <Image style={styles.audioIcon} source={require('../images/pause-blue.png')} />
            </TouchableOpacity>
            <Text style={styles.recordText}>{recordTime}</Text>
          </>
        )}
        {recordStep === 2 && (
          <View style={styles.recordIconsContainer}>
            <TouchableOpacity style={styles.audioWrapper} onPress={resetRecording}>
              <Image style={styles.smallIcon} source={require('../images/re_recording.png')} />
            </TouchableOpacity>
            {isRecordPlaying ? (
              <TouchableOpacity style={styles.audioWrapper} onPress={onStopPlay}>
                <Image style={styles.smallIcon} source={require('../images/pause.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.audioWrapper} onPress={onStartPlay}>
                <Image style={styles.smallIcon} source={require('../images/play.png')} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.audioWrapper} onPress={sendAudio}>
              <Image style={styles.smallIcon} source={require('../images/send-active.png')} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    height: 300,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderColor: Colors.grey,
    borderTopWidth: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordText: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10,
  },
  audioWrapper: {
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: Colors.lightGrey,
  },
  audioIcon: {
    width: 100,
    height: 100,
  },
  smallIcon: {
    width: 60,
    height: 60,
  },
  playIcon: {
    width: 20,
    height: 20,
  },
  recordIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  },
});
