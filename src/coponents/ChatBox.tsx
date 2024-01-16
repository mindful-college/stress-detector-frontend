import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import { Conversation } from '../types/checkin';
import ThrowUpFaceSvg from '../svg/ThrowUpFaceSvg';
import SadFaceSvg from '../svg/SadFaceSvg';
import StraightFaceSvg from '../svg/StraightFaceSvg';
import SmileyFaceSvg from '../svg/SmileyFaceSvg';
import HappyFaceSvg from '../svg/HappyFaceSvg';

type ChatBoxProps = {
  chat: Conversation;
};

export default function ChatBox({ chat }: ChatBoxProps) {
  if (chat.isChatbot) {
    return (
      <View style={styles.leftBox}>
        <Text>{chat.text}</Text>
      </View>
    );
  }

  if (chat.text) {
    return (
      <View style={styles.rightBox}>
        <Text>{chat.text}</Text>
      </View>
    );
  }

  if (chat.audio) {
    return (
      <View style={styles.rightBox}>
        <Text>Audio</Text>
      </View>
    );
  }

  if (chat.showIcon) {
    switch (chat.showIcon) {
      case 5:
        return (
          <View style={styles.rightBox}>
            <ThrowUpFaceSvg width="24" height="24" strokeWidth="6" />
          </View>
        );
      case 4:
        return (
          <View style={styles.rightBox}>
            <SadFaceSvg width="24" height="24" strokeWidth="6" />
          </View>
        );
      case 3:
        return (
          <View style={styles.rightBox}>
            <StraightFaceSvg width="24" height="24" strokeWidth="6" />
          </View>
        );
      case 2:
        return (
          <View style={styles.rightBox}>
            <SmileyFaceSvg width="24" height="24" strokeWidth="6" />
          </View>
        );
      case 1:
        return (
          <View style={styles.rightBox}>
            <HappyFaceSvg width="24" height="24" strokeWidth="6" />
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
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
  icon: {
    marginLeft: 10,
    width: 20,
    height: 24,
    zIndex: 100,
  },
});
