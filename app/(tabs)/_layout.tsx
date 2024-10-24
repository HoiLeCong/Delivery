import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function _layout() {
  
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#FF4646" },
        tabBarActiveTintColor: "#ff7891",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
          tabBarLabelStyle: { fontSize: 13 },
          headerTitle: "DANH SÁCH ĐƠN",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="received"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="shopping-bag" size={24} color={color} />
          ),
          tabBarLabel: "Received",
          tabBarLabelStyle: { fontSize: 13 },
          headerTitle: "ĐƠN HÀNG CỦA TÔI",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="delivery"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-shipping" size={24} color={color} />
          ),
          tabBarLabel: "Delivery",
          tabBarLabelStyle: { fontSize: 13 },
          headerTitle: "ĐƠN HÀNG TÔI SẼ GIAO",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
          tabBarLabelStyle: { fontSize: 13 },
          headerShown: false,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}