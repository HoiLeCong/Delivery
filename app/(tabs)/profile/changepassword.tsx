
// import {
//   Alert,
//   Button,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useState } from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import auth from 'firebase/auth';

// //Change Password
// const ChangePasswordScreen = () => {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // Add loading state


//   const toggleShowCurrentPassword = () => {
//     setShowCurrentPassword(!showCurrentPassword);
//   };
//   const toggleShowNewPassword = () => {
//     setShowNewPassword(!showNewPassword);
//   };
//   const toggleShowConfirmPassword = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleChangePassword = async () => {
//     setIsLoading(true); // Show loading indicator
//     try {
//       // 1. Re-authenticate the user
//       const user = auth().currentUser;
//       if (!user) {
//         throw new Error("User not found");
//       }
//       const credential = auth.EmailAuthProvider.credential(
//         user.email!,
//         currentPassword
//       );
//       await user.reauthenticateWithCredential(credential);

//       if (newPassword !== confirmNewPassword) {
//         throw new Error("New password and confirm password do not match");
//       }

//       await user.updatePassword(newPassword);

      
//       await auth().signInWithEmailAndPassword(user.email!, newPassword);

//       Alert.alert('Success', 'Password changed successfully!');
 
//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmNewPassword('');
//     } catch (error: any) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setIsLoading(false); 
//     }
//   };
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';   

import Ionicons from 'react-native-vector-icons/Ionicons';   

import auth from 'firebase/auth';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';


// Change Password for Shipper
const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);  

  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // const handleChangePassword = async () => {
  //   setIsLoading(true); 
  //   try {
  //     const authInstance = getAuth(); // Get auth instance
  //     const user = authInstance.currentUser;

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     // Re-authenticate the user
  //     const credential = EmailAuthProvider.credential(
  //       user.email!, 
  //       currentPassword
  //     );
  //     await reauthenticateWithCredential(user, credential);  


  //     if (newPassword !== confirmNewPassword) {
  //       throw new Error("New password and confirm password do not match");
  //     }

  //     // Update the password
  //     await updatePassword(user, newPassword);

  //     Alert.alert('Success', 'Password changed successfully!');
  //     setCurrentPassword('');
  //     setNewPassword('');
  //     setConfirmNewPassword('');

  //   } catch (error: any) {
  //     Alert.alert('Error', error.message); 
  //   } finally {
  //     setIsLoading(false); 
  //   }
  const handleChangePassword = async () => {
    setIsLoading(true); 
    try {
      const authInstance = getAuth(); 
      const user = authInstance.currentUser;

      if (!user) {
        throw new Error("User not found");
      }

      const credential = EmailAuthProvider.credential(
        user.email!, 
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);   
 

      if (newPassword !== confirmNewPassword) {
        throw new Error("New password and confirm password do not match");
      }

      await updatePassword(user, newPassword);

      // Password changed successfully
      Alert.alert('Success', 'Password changed successfully!'); 
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'auth/wrong-password') { 
        Alert.alert('Error', 'Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'New password is too weak.');
      } else {
        Alert.alert('Error', error.message); 
      }
    } finally {
      setIsLoading(false); 
    }
  };
  return (
        <ScrollView style={styles.container}>
          <Text style={styles.customText}>Current password</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>            
           <TextInput
              style={styles.input}
              placeholder="Enter current password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={text => setCurrentPassword(text)}
            />
    
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleShowCurrentPassword}>
              <Ionicons
                name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.customText}>New password</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
    
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleShowNewPassword}>
              <Ionicons
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.customText}>Confirm new password</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <TextInput
              style={styles.input}
              placeholder="Enter confirm new password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              secureTextEntry={!showConfirmPassword}
              value={confirmNewPassword}
              onChangeText={text => setConfirmNewPassword(text)}
            />
    
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleShowConfirmPassword}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Button
        color="#ff7891"
        title="Save"
        onPress={handleChangePassword}
        disabled={isLoading} 
      />
        </ScrollView>
      );
    };
export default ChangePasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 10,
  },
  customText: {
    fontSize: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    backgroundColor: '#F6F7FB',
    height: 58,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 26,
  },
});
