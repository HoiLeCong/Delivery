
// import {
//   Button,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
// } from "react-native";
// import React, { useState } from "react";
// import { Link, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import {firebaseConfig}  from "../src/firebase/firebaseConfig"; // Import your Firebase config
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc,} from "firebase/firestore";
// import { FirebaseError } from 'firebase/app';
// import {  ActivityIndicator } from "react-native"; 
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import   
 { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db, firebaseConfig } from "../src/firebase/firebaseConfig"; 
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FirebaseError } from 'firebase/app';
import { ActivityIndicator } from "react-native";
//import auth from "../src/firebase/firebaseConfig"; 



const auth = getAuth(initializeApp(firebaseConfig)); 
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  // const handleLogin = async () => {
  //   try {
  //     console.log("Email:", email); // In ra giá trị của email
  //     console.log("Password:", password); // In ra giá trị của password
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //      console.log("User credential:", userCredential);   
  //     // In ra kết quả của signInWithEmailAndPassword
  //        console.log("User:", user); // 
  //       router.replace("/home"); 
  //   } catch (error) {
  //     if (error instanceof FirebaseError) { 
  //       Alert.alert("Login Error", error.message);
  //     } else if (error instanceof Error) {
  //       Alert.alert("Login Error", error.message);
  //     } else {
  //       Alert.alert("Login Error", "An unknown error occurred.");
  //     }
  //   }
  //   // if (email && password) {
  //   //   setIsLoading(true);
  //   //   try {
  //   //     const userCredential = await auth().signInWithEmailAndPassword(
  //   //       email,
  //   //       password,
  //   //     );
  //   //     const usershiper = userCredential.user;

  //   //     if (usershiper) {
  //   //       const data = {
  //   //         // uid: usershiper.uid,
  //   //         // email: usershiper.email ?? '',
  //   //         // displayName: usershiper.displayName ?? '',
  //   //         // emailVerified: user.emailVerified,
  //   //         // photoUrl: user.photoURL,
  //   //         // creationTime: user.metadata.creationTime,
  //   //         // lastSignInTime: user.metadata.lastSignInTime,
  //   //         fullName: usershiper.fullName,
  //   //       email: usershiper.email ?? '',
  //   //       phoneNumber: usershiper.phoneNumber??'',
  //   //       CIN: usershiper.CIN,
  //   //       DateOfIssuance: usershiper.dateOfIssuance,
  //   //       avatar: usershiper.avatarUrl,
  //   //       image_CCCD_card_front: usershiper.frontUrl,
  //   //       image_CCCD_card_back: usershiper.backUrl,
  //   //       files_card_front: usershiper.filesFront.map(),
  //   //       files_card_back: usershiper.filesBack.map(),
  //   //       };
  //   //       dispatch(addAuth(data));
  //   //       await AsyncStorage.setItem(localDataNames.auth, JSON.stringify(data));
  //   //       await auth.UpdateProfile();
  //   //     }
  //   //     setIsLoading(false);
  //   //   } catch (error) {
  //   //     console.log(error);
  //   //     setIsLoading(false);
  //   //   }
  //   // } else {
  //   //   console.log('Missing values');
  //   // }
  // };
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to log in with email:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      console.log("User logged in. User ID:", userId);
 
      // Check if the user is a shipper
      const shipperDoc = await getDoc(doc(db, "shippers", userId));
      console.log("Checking shipper document existence...");
      if (shipperDoc.exists()) {
        console.log("Shipper found, navigating to shipper app.");
        router.push("/(tabs)/home");
      } else {
        console.log("Shipper not found, checking users...");
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          console.log("User found, navigating to user app.");
          router.push("/(tabs)/home");
        } else {
          Alert.alert(
            "Login Error",
            "This account is not authorized for either app."
          );
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={require("../assets/images/logoDelivery.png")} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Text style={styles.customText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            autoCapitalize="none"
            autoCorrect={false}
            numberOfLines={1}
            maxLength={32}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View>
          <Text style={styles.customText}>Password</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              autoCapitalize="none"
              maxLength={32}
              autoCorrect={false}
              textContentType="password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleShowPassword}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Link
          href="/forgotpassword"
          style={{
            textAlign: "right",
            marginTop: 10,
            marginBottom: 10,
            fontSize: 15,
          }}
        >
          Forgot password
        </Link>
        <TouchableOpacity style={styles.touch} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.textTouch}>Login</Text>
        )}
      </TouchableOpacity>
        {/* <TouchableOpacity style={styles.touch} onPress={handleLogin}> 
          <Text style={styles.textTouch}>Login</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 15,
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
    touch: {
      backgroundColor: "#ff7891",
      alignItems: "center",
      borderRadius: 30,
      padding: 12,
      marginTop: 10,
    },
    textTouch: {
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
    },
  });
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

function addAuth(data: {
  // uid: usershiper.uid,
  // email: usershiper.email ?? '',
  // displayName: usershiper.displayName ?? '',
  // emailVerified: user.emailVerified,
  // photoUrl: user.photoURL,
  // creationTime: user.metadata.creationTime,
  // lastSignInTime: user.metadata.lastSignInTime,
  fullName: any; email: any; phoneNumber: any; CIN: any; DateOfIssuance: any; avatar: any; image_CCCD_card_front: any; image_CCCD_card_back: any; files_card_front: any; files_card_back: any;
}): any {
  throw new Error("Function not implemented.");
}

