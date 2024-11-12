
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateEmail } from 'firebase/auth'; // Import hàm updateEmail

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
              fullName: userDocSnap.data().fullName || "",
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

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "shippers", user.uid);

        // Cập nhật email và số điện thoại
        await updateDoc(userDocRef, {
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
        <View style={styles.avatarContainer}>
          <Image
            source={
              deliveryPerson.avatar
                ? { uri: deliveryPerson.avatar }
                : require("../../../assets/images/imgAvatar.jpg")
            }
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        {/* Personal Details Section */}
        <Text style={styles.heading}>Personal Details</Text>

        {/* Ô nhập email */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.email}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, email: text })}
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


// import { View, Text, Image, StyleSheet } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

// const PersonalDetailsScreen= () => {
//   const [deliveryPerson, setDeliveryPerson] = useState({
//     avatar: null,
//     email: '',
//     phoneNumber: '',
//   });

//   useEffect(() => {
//     const fetchDeliveryPersonData = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (user) {
//           const db = getFirestore();
//           const userDocRef = doc(db, 'delivery_persons', user.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           if (userDocSnap.exists()) {
//             setDeliveryPerson({
//               avatar: userDocSnap.data().avatar || null,
//               email: userDocSnap.data().email || '',
//               phoneNumber: userDocSnap.data().phoneNumber || '',
//             });
//           } else {
//             // Handle case where delivery person document doesn't exist
//             console.log('No such document!');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching delivery person data:', error);
//       }
//     };

//     fetchDeliveryPersonData();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {deliveryPerson.avatar ? (
//         <Image source={{ uri: deliveryPerson.avatar }} style={styles.avatar} />
//       ) : (
//         <Image
//           source={require('../assets/images/icon')} 
//           style={styles.avatar}
//         />
//       )}
//       <Text style={styles.email}>{deliveryPerson.email}</Text>
//       <Text style={styles.phoneNumber}>{deliveryPerson.phoneNumber}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   email: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   phoneNumber: {
//     fontSize: 16,
//   },
// });

// export default PersonalDetailsScreen;