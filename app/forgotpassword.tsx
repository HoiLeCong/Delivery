// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const ForgotPasswordScreen = () => {
//   return (
//     <View>
//       <Text>ForgotPasswordScreen</Text>
//     </View>
//   )
// }

// export default ForgotPasswordScreen

// const styles = StyleSheet.create({})
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Xử lý logic gửi yêu cầu đặt lại mật khẩu ở đây
    console.log('Gửi yêu cầu đặt lại mật khẩu cho email:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.message}>
        *We will send you a message to set or reset your new password
      </Text>
      <TouchableOpacity style={styles.touch} onPress={handleSubmit}>
        <Text style={styles.textTouch}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    //textAlign: 'center',
  },
  touch: {
    backgroundColor: "#ff7891",
    alignItems: "center",
    borderRadius: 30,
    padding: 12,
    marginTop: 10,
  },
  textTouch: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default ForgotPassword;