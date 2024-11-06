
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
// import   
//  { getAuth } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';   
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import   { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; 


const PersonalDetailsScreen = () => {
  const [deliveryPerson, setDeliveryPerson] = useState({
    avatar: null,
    email: '',
    phoneNumber: '',
  });
  const [editing, setEditing] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhoneNumber, setEditingPhoneNumber] = useState(false);
  // useEffect(() => {
  //   const fetchDeliveryPersonData = async () => {
  //     try {
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  //       if (user) {
  //         const db = getFirestore();
  //         const userDocRef = doc(db, 'shippers', user.uid); 
  //         const userDocSnap = await getDoc(userDocRef);

  //         if (userDocSnap.exists()) {
  //           setDeliveryPerson({
  //             avatar: userDocSnap.data().avatar || null,
  //             email: userDocSnap.data().email || '',
  //             phoneNumber: userDocSnap.data().phoneNumber || '',
  //           });
  //         } else {
  //           console.log('No such document!');
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching delivery person data:', error);
  //     }
  //   };

  //   fetchDeliveryPersonData();
  // }, []);
  useEffect(() => {
    const fetchDeliveryPersonData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'shippers', user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setDeliveryPerson({
              avatar: userDocSnap.data().avatar || null,
              email: userDocSnap.data().email || '',
              phoneNumber: userDocSnap.data().phoneNumber || '',
            });
          } else {
            console.log('Không tìm thấy tài liệu!');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu shipper:', error);
      }
    };

    fetchDeliveryPersonData();
  }, []);

  // const handleSave = async () => { // Hàm xử lý khi nhấn nút "Lưu"
  //   try {
  //     const auth = getAuth();
  //     const user = auth.currentUser;
  //     if (user) {
  //       const db = getFirestore();
  //       const userDocRef = doc(db, 'shippers', user.uid);
  //       // Cập nhật số điện thoại trong Firestore
  //       await updateDoc(userDocRef, { 
  //         phoneNumber: deliveryPerson.phoneNumber,
  //       });
  //       setEditingPhoneNumber(false); // Đặt lại trạng thái chỉnh sửa thành false
  //       Alert.alert('Thành công', 'Số điện thoại đã được cập nhật!');
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi cập nhật số điện thoại:', error);
  //     Alert.alert('Lỗi', 'Không thể cập nhật số điện thoại.');
  //   }
  // };
  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'shippers', user.uid);
        await updateDoc(userDocRef, {
          email: deliveryPerson.email,
          phoneNumber: deliveryPerson.phoneNumber,
        });
        setEditingEmail(false);
        setEditingPhoneNumber(false);
        Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: 'https://example.com/avatar.jpg'}}
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

      {/* Ô nhập số điện thoại */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.phoneNumber}
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        editable={editing} 
      />

      {/* Nút Chỉnh sửa/Lưu */}
      {editing ? ( // Nếu đang chỉnh sửa, hiển thị nút "Lưu"
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      ) : ( // Nếu không chỉnh sửa, hiển thị nút "Chỉnh sửa thông tin"
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 120, // Adjust this value as per the alignment of the edit icon
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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