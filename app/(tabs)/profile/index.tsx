import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Link href={'/profile/personal'}>Gooo</Link>
      <Link href={'profile/changepassword'}>Chnage</Link>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})