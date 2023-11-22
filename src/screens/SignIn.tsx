import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';

interface SigninProps {
  navigation: any; // Type for navigation prop
}

const Signin: React.FC<SigninProps> = ({ navigation }) => {
  const [user, setUser] = useState({ email: '', password: '' });

  const handleSignIn = () => {
    // Implement your sign-in logic here
    console.log('Signing in with:', user);
    // Navigate to another screen after successful sign-in
    navigation.navigate('Home');
  };

  const handleEamil = (email) => {
    setUser((prevUser) => ({ ...prevUser, email }));
  };

  const handlePassword = (password) => {
    setUser((prevUser) => ({ ...prevUser, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={handleEamil}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={user.password}
        onChangeText={handlePassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default Signin;
