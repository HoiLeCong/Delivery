import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'

const LoginScreen = () => {
  return (
    <View>
      <Text>LoginScreen</Text>
      <Button title='Go' onPress={()=> router.navigate('/home')}></Button>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})