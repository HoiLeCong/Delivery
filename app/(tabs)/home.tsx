import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, orderRef } from "@/src/firebase/firebaseConfig";
import {
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  collection,
  updateDoc,
} from "firebase/firestore";

const ItemComponent = ({ item, onPress, expanded, handleConfirmOrder }) => {
  const animatedHeight = useState(new Animated.Value(140))[0];
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 450 : 140,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]); 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Animated.View
          style={[styles.itemContainer, { height: animatedHeight }]}
        >
          <View style={styles.itemOrderFlatList}>
            <View style={styles.itemLineOrderFlatList}>
              <Text style={styles.title}>Mã đơn:</Text>
              <Text style={styles.contentTitle}>{item.id}</Text>
            </View>
            <View style={styles.itemLineOrderFlatList}>
              <Text style={styles.title}>Người gửi:</Text>
              <Text style={styles.contentTitle}>Fashion Shop</Text>
            </View>
            <View style={styles.itemLineOrderFlatList}>
              <Text style={styles.title}>Người nhận:</Text>
              <Text style={styles.contentTitle}>{item.displayName}</Text>
            </View>
            <View style={styles.itemLineOrderFlatList}>
              <Text style={styles.title}>Số điện thoại:</Text>
              <Text style={styles.contentTitle}>{item.phoneNumber}</Text>
            </View>
            <View style={styles.itemLineOrderFlatList}>
              <Text style={styles.title}>Địa chỉ:</Text>
              <Text style={styles.contentTitle}>{item.address}</Text>
            </View>

            {expanded && (
              <View>
                <View style={styles.itemLineOrderFlatList}>
                  <Text style={styles.title}>Sản phẩm:</Text>
                  <Text style={styles.contentTitle}>{item.productNames}</Text>
                </View>

                <View style={styles.itemLineOrderFlatList}>
                  <Text style={styles.title}>Total amount:</Text>
                  <Text style={styles.contentTitle}>${item.totalPrice}</Text>
                </View>
                <View style={styles.itemLineOrderFlatList}>
                  <Text style={styles.title}>PT thanh toán:</Text>
                  <Text style={styles.contentTitle}>
                    {item.paymentMethodName}
                  </Text>
                </View>
                <View style={styles.itemLineOrderFlatList}>
                  <Text
                    style={[
                      styles.contentTitle,
                      { color: "black", fontWeight: "bold" },
                    ]}
                  >
                    Tổng: {item.items.length} sản phẩm.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.touch}
                  onPress={() => handleConfirmOrder(item.id)}
                >
                  <Text style={styles.textTouch}>Nhận đơn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track expanded item

  useEffect(() => {
    const q = query(orderRef, where("orderStatusId", "==", "3"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        console.log("Orders snapshot received:", snapshot.size); // Log snapshot size
        const ordersData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const order = docSnapshot.data(); // Use docSnapshot to get data
            const userId = order.userId; // Extract userId from the order data
            const paymentMethodId = order.paymentMethodId; // Extract paymentMethodId from the order data

            let paymentMethodName = "Unknown Payment Method"; // Default value for payment method name

            try {
              // Reference the users collection
              const userRef = collection(db, "users");
              // Get the specific user document
              const userDoc = await getDoc(doc(userRef, userId));

              if (userDoc.exists()) {
                
                const { displayName, phoneNumber } = userDoc.data();

                // Now get the payment method name
                const paymentMethodsRef = collection(db, "paymentMethod"); // Reference to the paymentMethods collection
                const paymentMethodDoc = await getDoc(
                  doc(paymentMethodsRef, paymentMethodId)
                ); // Get the payment method document

                if (paymentMethodDoc.exists()) {
                  const paymentMethodData = paymentMethodDoc.data();
                  paymentMethodName = paymentMethodData.paymentMethodName; // Assume the field is 'name'
                } else {
                  console.warn(
                    `Payment method not found for paymentMethodId: ${paymentMethodId}`
                  );
                }

                // Extract product names from the order items
                const productNames = order.items
                  .map((item: { title: any; }) => item.title)
                  .join("\n"); // Join names as a string

                return {
                  id: docSnapshot.id, // Use docSnapshot.id here
                  ...order,
                  displayName: displayName,
                  phoneNumber: phoneNumber,
                  paymentMethodName: paymentMethodName,
                  productNames: productNames,
                };
              } else {
                console.warn(`User not found for userId: ${userId}`);
                return {
                  id: docSnapshot.id,
                  ...order,
                  displayName: "Unknown User",
                  userPhone: "No Phone",
                  paymentMethodName: paymentMethodName, // Default value
                  productNames: "No Products", // Default value if no user found
                };
              }
            } catch (error) {
              console.error(
                `Error fetching user or payment method data:`,
                error
              );
              return {
                id: docSnapshot.id,
                ...order,
                displayName: "Error",
                userPhone: "Error",
                paymentMethodName: paymentMethodName, // Default value
                productNames: "Error retrieving products", // Default value
              };
            }
          })
        );

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time orders: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  const handlePress = (id: React.SetStateAction<null>) => {
    setExpandedId(id === expandedId ? null : id); // Toggle expand/collapse
  };

  const handleConfirmOrder = async (orderId: string | undefined) => {
    const shipperId = auth.currentUser?.uid;
    if (shipperId) {
      try {
        const orderDocRef = doc(orderRef, orderId);
        await updateDoc(orderDocRef, {
          shipperId: shipperId,
          orderStatusId: '4',
        });
        console.log(
          `Order ${orderId} has been confirmed with shipper ID: ${shipperId}`
        );
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    } else {
      console.error("No shipper is logged in.");
    }
    
  };

  const renderItem = ({ item }) => (
    <ItemComponent
      item={item}
      expanded={item.id === expandedId}
      onPress={() => handlePress(item.id)}
      handleConfirmOrder={handleConfirmOrder}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDCDC",
  },
  itemContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  itemOrderFlatList: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 10,
  },
  itemLineOrderFlatList: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginVertical: 4,
  },
  title: {
    flex: 0.5,
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  contentTitle: {
    fontSize: 17,
    color: "black",
    flex: 1,
    overflow: "hidden", // Hide overflow
  },
  touch: {
    borderRadius: 10,
    backgroundColor: "#ff7891",
    width: "100%",
    marginTop: 10,
  },
  textTouch: {
    fontSize: 20,
    padding: 3,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

