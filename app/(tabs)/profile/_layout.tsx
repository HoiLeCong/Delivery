import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#FF4646" } }}>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "Profile" }}
      ></Stack.Screen>
      <Stack.Screen
        name="personal"
        options={{ headerTitle: "Personal" }}
      ></Stack.Screen>
      <Stack.Screen
        name="changepassword"
        options={{ headerTitle: "Change Password" }}
      ></Stack.Screen>
    </Stack>
  );
}