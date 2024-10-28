// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const PersonalDetailsScreen = () => {
//   return (
//     <View>
//       <Text>PersonalDetailsScreen</Text>
//     </View>
//   )
// }
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const PersonalDetailsScreen = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: 'https://example.com/avatar.jpg'}}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Details Section */}
      <Text style={styles.heading}>Personal Details</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        keyboardType="email-address"
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        keyboardType="phone-pad"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 120, // Adjust this value as per the alignment of the edit icon
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default PersonalDetailsScreen

//const styles = StyleSheet.create({})