
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import   
 { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';   


const PersonalDetailsScreen = () => {
  const [deliveryPerson, setDeliveryPerson] = useState({
    avatar: null,
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchDeliveryPersonData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'shippers', user.uid); // Assuming 'delivery_persons' is your collection
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setDeliveryPerson({
              avatar: userDocSnap.data().avatar || null,
              email: userDocSnap.data().email || '',
              phoneNumber: userDocSnap.data().phoneNumber || '',
            });
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching delivery person data:', error);
      }
    };

    fetchDeliveryPersonData();
  }, []);
  return (
    <View style={styles.container}>
      {/* Avatar Section */}
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

      {/* Email Input */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.email} // Set the value from state
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, email: text })}
        placeholder="Email Address"
        keyboardType="email-address"
        editable={false} // Make the field non-editable
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        value={deliveryPerson.phoneNumber} // Set the value from state
        onChangeText={(text) => setDeliveryPerson({ ...deliveryPerson, phoneNumber: text })}
        placeholder="Phone number"
        keyboardType="phone-pad"
        editable={false} // Make the field non-editable
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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