import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import {auth} from '../src/firebase/firebaseConfig'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); 

  const handleSubmit = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      await auth().sendPasswordResetEmail(email); // Sử dụng auth()
      setMessage('Email đặt lại mật khẩu đã được gửi!');
      setEmail(''); 
      //navigation.navigate('index'); 
    } catch (error: any) { // Hoặc sử dụng FirebaseError từ firebase/app
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        setMessage('Không tìm thấy tài khoản với email này.');
      } else if (error.code === 'auth/invalid-email') {
        setMessage('Địa chỉ email không hợp lệ.');
      } else {
        setMessage('Đã có lỗi xảy ra.');
      }
    } finally {
      setIsLoading(false);
    }
   
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input,{marginTop: 20}]}
        placeholder="Nhập địa chỉ email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={{color:'gray', marginBottom:10
      }}>
       We will send you a message to set or reset your new password
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Gửi</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth:1
  },
  message: {
    color: "red",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff7891",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign:'center'
  },
});

export default ForgotPassword;