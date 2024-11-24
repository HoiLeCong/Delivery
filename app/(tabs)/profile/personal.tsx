
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateEmail } from 'firebase/auth'; // Import hàm updateEmail
import { ScrollView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';

const PersonalDetailsScreen = () => {
  const [deliveryPerson, setDeliveryPerson] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    CIN: "",
    DateOfIssuance: "",
    avatar: null,
    frontCard: "",
    backCard: "",
  });
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
    // Hàm thay đổi ảnh đại diện
    const handleAvatarChange = async () => {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (!result.didCancel && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const imageUri = selectedImage.uri;
        const filename = selectedImage.fileName || `avatar_${Date.now()}.jpg`;
  
        // Tạo tham chiếu đến Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, 'avatars/' + filename);
  
        // Upload ảnh lên Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
  
        // Lấy URL của ảnh đã tải lên
        const downloadURL = await getDownloadURL(storageRef);
  
        // Cập nhật state với URL ảnh mới
        setDeliveryPerson({ ...deliveryPerson, avatar: downloadURL });
  
        // Cập nhật Firestore với URL ảnh mới
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, "shippers", user.uid);
          await updateDoc(userDocRef, { avatar: downloadURL });
        }
  
        Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật!");
      }
    };
    // const handleChoosePhoto = async () => {
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
    
    //         const userDocRef = firestore().collection('users').doc(user.uid);
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
          source={{ uri: deliveryPerson.avatar || 'https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg' }}
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
