import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const ChangePasswordScreen = () => {
  const [currenPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.customText}>Current password</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          secureTextEntry={!showCurrentPassword}
          value={currenPassword}
          onChangeText={(text) => setCurrentPassword(text)}
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleShowCurrentPassword}
        >
          <Ionicons
            name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.customText}>New password</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleShowNewPassword}
        >
          <Ionicons
            name={showNewPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.customText}>Confirm new password</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter confirm new password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          secureTextEntry={!showConfirmPassword}
          value={confirmNewPassword}
          onChangeText={(text) => setConfirmNewPassword(text)}
        />

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleShowConfirmPassword}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Button color='#ff7891' title="Save" onPress={()=> Alert.alert('Save')} ></Button>
    </ScrollView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 10
  },
  customText: {
    fontSize: 20,
    color: "black",
  },
  input: {
    width: "100%",
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    top: 26,
  },
});
