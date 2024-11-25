
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateEmail } from 'firebase/auth'; // Import hàm updateEmail
import { ScrollView } from 'react-native';
//import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';





const PersonalDetailsScreen = () => {
  // const [deliveryPerson, setDeliveryPerson] = useState({
  //   fullName: "",
  //   email: "",
  //   phoneNumber: "",
  //   CIN: "",
  //   DateOfIssuance: "",
  //   avatar:  null,
  //   frontCard: "",
  //   backCard: "",
  // });
  const [deliveryPerson, setDeliveryPerson] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    CIN: string;
    DateOfIssuance: string;
    avatar: string | null;  // Chỉnh sửa để avatar có thể là string hoặc null
    frontCard: string;
    backCard: string;
}>({
    fullName: "",
    email: "",
    phoneNumber: "",
    CIN: "",
    DateOfIssuance: "",
    avatar: null, // Ban đầu avatar là null
    frontCard: "",
    backCard: "",
});
const auth = getAuth();
const storage = getStorage();
const firestore = getFirestore();


  const [editing, setEditing] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);

  useEffect(() => {
    const fetchDeliveryPersonData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, "shippers", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setDeliveryPerson({
              avatar: userDocSnap.data().avatar || null,
              fullName: userDocSnap.data().fullName || null,
              email: userDocSnap.data().email || "",
              phoneNumber: userDocSnap.data().phoneNumber || "",
              CIN: userDocSnap.data().CIN || "",
              DateOfIssuance: userDocSnap.data().dateOfIssuance || "",
              frontCard: userDocSnap.data().image_CCCD_card_front || null,
              backCard: userDocSnap.data().image_CCCD_card_back || null,
            });
          } else {
            console.log("Không tìm thấy tài liệu!");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu shipper:", error);
      }
    };

    fetchDeliveryPersonData();
  }, []);
    // Hàm yêu cầu quyền và chọn ảnh
  // const handleAvatarChange = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert('Quyền truy cập bị từ chối', 'Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện');
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chọn ảnh
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const source = result.assets[0].uri;
  //     uploadAvatar(source);
  //   } 
  // };
  const handleAvatarChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Sử dụng enum thay vì số
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = result.assets[0].uri;
      uploadAvatar(source);
    }
  };

  // Hàm tải ảnh lên Firebase Storage và cập nhật URL vào Firestore
  const uploadAvatar = async (uri: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Người dùng chưa đăng nhập');
      }
  
      const response = await fetch(uri);
      const blob = await response.blob();
      const reference = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(reference, blob);
  
      const url = await getDownloadURL(reference);
      setDeliveryPerson((prevState) => ({
        ...prevState,
        avatar: url,
      }));
  
      const userDocRef = doc(firestore, 'shippers', user.uid);
      await updateDoc(userDocRef, { avatar: url });
  
      Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật!');
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên Firebase.');
    }
  };
  
  
    // const handleAvatarChange = async () => {
    //   try {
    //     const user = auth().currentUser;
    //     if (!user) {
    //       throw new Error('Người dùng chưa đăng nhập');
    //     }
    
    //     // Mở thư viện ảnh
    //     const result = await launchImageLibrary({
    //       mediaType: 'photo',  // hoặc 'video'
    //       quality: 1,
    //     });
    
    //     if (!result.didCancel && result.assets?.[0]) {
    //       const source = result.assets[0].uri;
    //       console.log('URI ảnh:', source);
    
    //       if (source) {
    //         const reference = storage().ref(`avatars/${user.uid}.jpg`);
    //         await reference.putFile(source);
    
    //         const url = await reference.getDownloadURL();
    //         console.log('URL ảnh: ', url);
    
    //         setDeliveryPerson((prevState) => ({
    //           ...prevState,
    //           avatar: url,
    //         }));
    
    //         const userDocRef = firestore().collection('shippers').doc(user.uid);
    //         await userDocRef.update({ avatar: url });
    //       } else {
    //         Alert.alert('Lỗi', 'Không có ảnh nào được chọn.');
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Lỗi khi tải ảnh lên:', error);
    //     Alert.alert('Lỗi', 'Không thể tải ảnh lên Firebase.');
    //   }
    // };
    
  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "shippers", user.uid);

        // Cập nhật email và số điện thoại
        await updateDoc(userDocRef, {
          fullName: deliveryPerson.fullName,
          email: deliveryPerson.email,
          phoneNumber: deliveryPerson.phoneNumber,
        });

        setEditing(false);
        Alert.alert("Thành công", "Thông tin đã được cập nhật!");
        // Cập nhật email trên Firebase Authentication
        await updateEmail(user, deliveryPerson.email);

        setEditing(false);
        Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
      {/* <View style={styles.avatarContainer}>
          <Image
            source={deliveryPerson.avatar ? { uri: deliveryPerson.avatar } : require("../../../assets/images/imgAvatar.jpg")}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editIconContainer} onPress={handleAvatarChange}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View> */}
         <View style={styles.avatarContainer}>
          <Image
            source={deliveryPerson.avatar ? { uri: deliveryPerson.avatar } : require("../../../assets/images/imgAvatar.jpg")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIconContainer} onPress={handleAvatarChange}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        {/* Personal Details Section */}
        <Text style={styles.heading}>Personal Details</Text>

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={deliveryPerson.fullName}
          onChangeText={(text) =>
            setDeliveryPerson({ ...deliveryPerson, fullName: text })
          }
          placeholder="Họ và tên"
          keyboardType="email-address"
          editable={editing}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={deliveryPerson.email}
          onChangeText={(text) =>
            setDeliveryPerson({ ...deliveryPerson, email: text })
          }
          placeholder="Địa chỉ email"
          keyboardType="email-address"
          editable={editing}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={deliveryPerson.phoneNumber}
          onChangeText={(text) =>
            setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })
          }
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          editable={editing}
        />
        <Text style={styles.label}>Số căn cước công dân</Text>
        <Text style={styles.input}>{deliveryPerson.CIN}</Text>
        <Text style={styles.label}>Ngày cấp</Text>
        <Text style={styles.input}>{deliveryPerson.DateOfIssuance}</Text>
        <Text style={styles.label}>Mặt trước căn cước công dân</Text>
        <Image
          source={
            deliveryPerson.frontCard
              ? { uri: deliveryPerson.frontCard }
              : require("../../../assets/images/imgAvatar.jpg")
          }
          style={{ width: "100%", height: 200 }}
        />
        <Text style={styles.label}>Mặt sau căn cước công dân</Text>
        <Image
          source={
            deliveryPerson.backCard
              ? { uri: deliveryPerson.backCard }
              : require("../../../assets/images/imgAvatar.jpg")
          }
          style={{ width: "100%", height: 200 }}
        />
      </ScrollView>

      {/* Nút Chỉnh sửa/Lưu */}
      {editing ? ( // Nếu đang chỉnh sửa, hiển thị nút "Lưu"
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      ) : (
        // Nếu không chỉnh sửa, hiển thị nút "Chỉnh sửa thông tin"
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#e1e1e1",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 120, // Adjust this value as per the alignment of the edit icon
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default PersonalDetailsScreen
