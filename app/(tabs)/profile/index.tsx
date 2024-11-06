import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Authentication




const ProfileScreen = () => {
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      // Chuyển hướng đến màn hình đăng nhập sau khi đăng xuất
      router.replace('/'); // Thay thế '/' bằng đường dẫn đến màn hình đăng nhập 
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất.');
    }
  };
  return (
    <View
      style={{ flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 20 }}
    >
      <TouchableOpacity
        onPress={() => router.navigate("/profile/personal")}
        style={styles.touchableOpacity}
      >
        <FontAwesome5
          name="user-edit"
          size={24}
          color="black"
          style={{ flex: 0.1 }}
        />
        <Text style={styles.textTouch}>Personal Details</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.navigate("/profile/changepassword")}
        style={styles.touchableOpacity}
      >
        <MaterialIcons
          name="password"
          size={24}
          color="black"
          style={{ flex: 0.1 }}
        />
        <Text style={styles.textTouch}>ChangPassword</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.touchableOpacity}>
        <AntDesign name="logout" size={24} color="black" style={{ flex: 0.1 }} />
        <Text style={styles.textTouch}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  touchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
  },
  textTouch: { flex: 1, marginLeft: 15, fontSize: 20, color: "black" },
});