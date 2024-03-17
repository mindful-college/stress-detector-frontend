import React from 'react';
import { ScrollView, Text, StyleSheet, Modal, View } from 'react-native';
import { Colors } from '../utils/colors';
import ModalHeader from './ModalHeader';

const PrivacyModal = ({ isPrivacyPolicyModalVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isPrivacyPolicyModalVisible}
      onRequestClose={() => {}}>
      <ModalHeader title="PRIVACY POLICY" onClose={onClose} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text>{`This Privacy Policy describes how Mindful College ("we", "us", or "our") collects, uses, and shares personal information when you use our mobile application (the "App").`}</Text>

        <Text style={styles.subheading}>Information We Collect</Text>
        <Text>{`Information You Provide: When you register an account, fill out forms, or communicate with us, we may collect personal information such as your name, email address, and any other information you choose to provide.`}</Text>
        <Text>{`Usage Data: We may automatically collect information about how you interact with the App, such as your device information, IP address, and usage patterns.`}</Text>

        <Text style={styles.subheading}>How We Use Your Information</Text>
        <Text>{`We may use the information we collect for the following purposes:`}</Text>
        <Text>- To provide and maintain the App.</Text>
        <Text>- To personalize your experience and deliver customized content.</Text>
        <Text>
          - To communicate with you, including responding to your inquiries and providing customer
          support.
        </Text>
        <Text>- To analyze usage trends and improve the App's functionality.</Text>

        <Text style={styles.subheading}>Information Sharing</Text>
        <Text>{`We may share your personal information with third parties only in the following circumstances:`}</Text>
        <Text>- With your consent.</Text>
        <Text>- To comply with legal obligations or protect our rights.</Text>
        <Text>
          - With service providers who assist us in operating the App or providing services to you.
        </Text>

        <Text style={styles.subheading}>Data Retention</Text>
        <Text>{`We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.`}</Text>

        <Text style={styles.subheading}>Security</Text>
        <Text>{`We take reasonable measures to protect your personal information from unauthorized access, disclosure, or alteration.`}</Text>

        <Text style={styles.subheading}>Your Choices</Text>
        <Text>{`You may choose not to provide certain personal information, but this may limit your ability to use certain features of the App.`}</Text>

        <Text style={styles.subheading}>Changes to This Policy</Text>
        <Text>{`We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.`}</Text>

        <Text style={styles.subheading}>Contact Us</Text>
        <Text>{`If you have any questions or concerns about this Privacy Policy, please contact us at jijeong0114@gmail.com.`}</Text>
        <View style={styles.block} />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  block: {
    height: 40,
  },
});

export default PrivacyModal;
