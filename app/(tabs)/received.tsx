import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated'

const Received = () => {
  return (

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>

  );
}

export default Received

const styles = StyleSheet.create({})