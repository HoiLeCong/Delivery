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
import React, { useEffect, useState } from "react";
import { auth, db, deliveryHistoryRef, orderRef } from "@/src/firebase/firebaseConfig";
import {
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  collection,
  updateDoc,
  setDoc,
} from "firebase/firestore";
const ItemComponent = ({ item, onPress, expanded, handleCancelOrder, handleConfirmReceived }) => {
  const animatedHeight = useState(new Animated.Value(140))[0]; // Default collapsed height

  // Animate item height based on expanded state
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 500 : 140,
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
                <View
                  style={[
                    styles.itemLineOrderFlatList,
                    { justifyContent: "flex-end" },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.touch, { backgroundColor: "red" }]}
                    onPress={()=> handleCancelOrder(item.id)}
                  >
                    <Text style={styles.textTouch}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=> handleConfirmReceived(item.id)}
                    style={[
                      styles.touch,
                      { marginLeft: 10, backgroundColor: "green" },
                    ]}
                  >
                    <Text style={styles.textTouch}>Nhận hàng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const Received = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track expanded item

  useEffect(() => {
    const shipperId = auth.currentUser?.uid;

    if (!shipperId) {
      console.warn("No authenticated user found.");
      setLoading(false);
      return; // Exit if there is no authenticated user
    }

    const q = query(
      orderRef,
      where("orderStatusId", "==", "4"),
      where("shipperId", "==", shipperId)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        console.log("Orders snapshot received:", snapshot.size);
        const ordersData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const order = docSnapshot.data();
            const userId = order.userId;
            const paymentMethodId = order.paymentMethodId;

            let paymentMethodName = "Unknown Payment Method";

            try {
              // Fetch user data
              const userRef = doc(db, "users", userId);
              const userDoc = await getDoc(userRef);

              const userData = userDoc.exists() ? userDoc.data() : null;
              const { displayName = "Unknown User", phoneNumber = "No Phone" } =
                userData || {};

              // Fetch payment method data
              const paymentMethodRef = doc(
                db,
                "paymentMethod",
                paymentMethodId
              );
              const paymentMethodDoc = await getDoc(paymentMethodRef);

              if (paymentMethodDoc.exists()) {
                paymentMethodName = paymentMethodDoc.data().paymentMethodName;
              } else {
                console.warn(
                  `Payment method not found for paymentMethodId: ${paymentMethodId}`
                );
              }

              // Extract product names
              const productNames = order.items
                .map((item) => item.title)
                .join(", ");

              return {
                id: docSnapshot.id,
                ...order,
                displayName,
                phoneNumber,
                paymentMethodName,
                productNames,
              };
            } catch (error) {
              console.error(
                "Error fetching user or payment method data:",
                error
              );
              return {
                id: docSnapshot.id,
                ...order,
                displayName: "Error",
                phoneNumber: "Error",
                paymentMethodName,
                productNames: "Error retrieving products",
              };
            }
          })
        );

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  const handleCancelOrder = async(orderId: string | undefined) =>{
    const shipperId = null;
    try {
      const orderDocRef = doc(orderRef, orderId)
      await updateDoc(orderDocRef , {
        shipperId,
        orderStatusId :'3'
      })
    console.log(
          `Order ${orderId} has been confirmed with shipper ID: ${shipperId}`
        );
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    } 
    const handleConfirmReceived = async (orderId: string | undefined) => {
      try {
        const shipperId = auth.currentUser?.uid;

        if (!shipperId) {
          console.error("User not authenticated");
          return;
        }
        const orderDocRef = doc(orderRef, orderId);

        await updateDoc(orderDocRef, {
          orderStatusId: "5", 
        });

        const deliveryHistoryDocRef = doc(
          collection(deliveryHistoryRef, shipperId, "orders"),
          orderId
        );
        const orderSnapshot = await getDoc(orderDocRef);
        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data();

          await setDoc(deliveryHistoryDocRef, {
            ...orderData,
            orderStatusId: "5",
            confirmedAt: new Date(), 
          });
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.log("Error in order handling:", error.message);
      }
    };


  const handlePress = (id: React.SetStateAction<null>) => {
    setExpandedId(id === expandedId ? null : id); // Toggle expand/collapse
  };

  const renderItem = ({ item }) => (
    <ItemComponent
      item={item}
      expanded={item.id === expandedId}
      onPress={() => handlePress(item.id)}
      handleCancelOrder = {handleCancelOrder}
      handleConfirmReceived = {handleConfirmReceived}
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

export default Received;

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
    borderRadius: 20,
    width: "35%",
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
