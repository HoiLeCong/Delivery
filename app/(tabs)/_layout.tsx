import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { AntDesign, EvilIcons, Feather } from '@expo/vector-icons';

export default function _layout() {
  
  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: "#FF4646" }, tabBarActiveTintColor:'#ff3891', tabBarInactiveTintColor:'black' }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
          headerTitle: "DANH SÁCH ĐƠN",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="received"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-bag" size={24} color={color} />
          ),
          tabBarLabel: "Received",
          headerTitle: "ĐƠN HÀNG CỦA TÔI",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="delivery"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="staro" size={24} color={color} />
          ),
          tabBarLabel: "Delivery",
          headerTitle: "ĐƠN HÀNG TÔI SẼ GIAO",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <EvilIcons name="user" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
          headerShown: false,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}