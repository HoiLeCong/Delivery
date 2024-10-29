import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import   
 { auth } from '../src/firebase/firebaseConfig'; 
import { sendPasswordResetEmail, updatePassword } from 'firebase/auth'; 
import { firestore } from '../src/firebase/firebaseConfig'; // Import Firestore

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword]   
 = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');   

  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    if (isChangePasswordMode) {
      // Change password logic
      if (newPassword !== confirmPassword) {
        setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
        setIsLoading(false);
        return;
      }

      try {
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, newPassword);
          setMessage('Mật khẩu đã được thay đổi!');
          setNewPassword('');
          setConfirmPassword('');

          // Cập nhật Firestore sau khi thay đổi mật khẩu
          const userRef = firestore.collection('users').doc(user.uid);
          await userRef.update({ 
            lastPasswordChange: new Date() 
          });

        } else {
          setMessage('Vui lòng đăng nhập để thay đổi mật khẩu.');
        }
      } catch (error) {
        console.error("Error updating password:", error);
        setMessage('Đã có lỗi xảy ra khi thay đổi mật khẩu.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // Forgot password logic (send reset email)
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage('Email đặt lại mật khẩu đã được gửi!');
        setEmail('');
      } catch (error) {
        console.error("Error sending password reset email:", error);
        switch (error) {
          case 'auth/user-not-found':
            setMessage('Không tìm thấy tài khoản với email này.');
            break;
          case 'auth/invalid-email':
            setMessage('Địa chỉ email không hợp lệ.');
            break;
          default:
            setMessage('Đã có lỗi xảy ra.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default ForgotPassword;