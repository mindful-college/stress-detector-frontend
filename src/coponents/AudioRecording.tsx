import React, { useState, useEffect } from 'react';
import { Dimensions, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import type { AudioSet, PlayBackType, RecordBackType } from 'react-native-audio-recorder-player';
// import RNFetchBlob from 'rn-fetch-blob';
import CustomButton from './CustomButton';

type AudioRecordingProps = {
  setVoice: any;
};

export default function AudioRecording({ setVoice }: AudioRecordingProps) {
  const screenWidth = Dimensions.get('screen').width;
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [path, setPath] = useState<string | undefined>(undefined);
  // const dirs = RNFetchBlob.fs.dirs;
  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.1);

  useEffect(() => {
    setPath(
      Platform.select({
        ios: undefined,
        android: undefined,
      }),
    );
  }, []);

  const onStatusPress = (e: any): void => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);

    const playWidth = (currentPositionSec / currentDurationSec) * (screenWidth - 56);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(currentPositionSec);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  };

  const onStartRecord = async (): Promise<void> => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    console.log('audioSet', audioSet);

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      // console.log('record-back', e);
      console.log(recordSecs);
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    console.log(`uri: ${uri}`);
  };

  const onPauseRecord = async (): Promise<void> => {
    try {
      const r = await audioRecorderPlayer.pauseRecorder();
      console.log(r);
    } catch (err) {
      console.log('pauseRecord', err);
    }
  };

  const onResumeRecord = async (): Promise<void> => {
    await audioRecorderPlayer.resumeRecorder();
  };

  const onStopRecord = async (): Promise<void> => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onStartPlay = async (): Promise<void> => {
    console.log('onStartPlay', path);

    try {
      const msg = await audioRecorderPlayer.startPlayer(path);
      const volume = await audioRecorderPlayer.setVolume(1.0);
      console.log(`path: ${msg}`, `volume: ${volume}`);

      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        console.log('playBackListener', e);
        setCurrentDurationSec(e.duration);
        setCurrentPositionSec(e.currentPosition);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };

  const onPausePlay = async (): Promise<void> => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async (): Promise<void> => {
    await audioRecorderPlayer.resumePlayer();
  };

  const onStopPlay = async (): Promise<void> => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <SafeAreaView>
      <Text>Audio Recorder Player</Text>
      <Text>{recordTime}</Text>
      <View>
        <View>
          <CustomButton
            color="blue"
            backgroundColor="gray"
            title="Record"
            onPress={onStartRecord}
          />
          <CustomButton color="blue" backgroundColor="gray" onPress={onPauseRecord} title="Pause" />
          <CustomButton
            color="blue"
            backgroundColor="gray"
            onPress={onResumeRecord}
            title="Resume"
          />
          <CustomButton color="blue" backgroundColor="gray" onPress={onStopRecord} title="stop" />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={onStatusPress}>
          <Text>On Status PRess</Text>
        </TouchableOpacity>
        <Text>
          {playTime} / {duration}
        </Text>
        <View>
          <CustomButton color="blue" backgroundColor="gray" title="Play" onPress={onStartPlay} />
          <CustomButton color="blue" backgroundColor="gray" title="Pause" onPress={onPausePlay} />
          <CustomButton color="blue" backgroundColor="gray" title="Resume" onPress={onResumePlay} />
          <CustomButton color="blue" backgroundColor="gray" title="stop" onPress={onStopPlay} />
        </View>
      </View>
    </SafeAreaView>
  );
}
