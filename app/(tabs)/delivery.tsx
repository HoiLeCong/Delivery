import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import Dialog from 'react-native-dialog'

const ItemComponent = ({
  item,
  onPress,
  expanded,
  handleCancelOrder,
  handleSuccess,
  handleReturn
}) => {
  const animatedHeight = useState(new Animated.Value(140))[0]; // Default collapsed height

  // Animate item height based on expanded state
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 420 : 140,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const backgroundColor =
    item.orderStatusId === "5"
      ? "#04CDC1"
      : item.orderStatusId === "6"
      ? "#04CD18"
      : item.orderStatusId === "7"
      ? "red"
      : item.orderStatusId === "8"
      ? "#CEBA08"
      : "defaultColor";
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Animated.View
          style={[styles.itemContainer, { height: animatedHeight }]}
        >
          <View style={[styles.itemOrderFlatList, { backgroundColor }]}>
            {expanded && (
              <View style={styles.itemLineOrderFlatList}>
                <Text style={styles.title}>Mã đơn:</Text>
                <Text style={styles.contentTitle}>{item.id}</Text>
              </View>
            )}

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
                {item.orderStatusId == 7 ? (
                  <View style={styles.itemLineOrderFlatList}>
                    <Text style={styles.title}>Ghi chú:</Text>
                    <Text style={styles.contentTitle}>{item.cancelReason}</Text>
                  </View>
                ) : (
                  ""
                )}
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
                    style={styles.buttonCancel}
                    onPress={() => handleCancelOrder(item.id)}
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSuccess(item.id)}
                    style={styles.buttonSuccess}
                  >
                    <Text style={styles.buttonText}>Thành công</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleReturn(item.id)}
                    style={styles.buttonReturn}
                  >
                    <Text style={styles.buttonText}>Lưu{"\n"}kho</Text>
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

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track expanded item
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const shipperId = auth.currentUser?.uid;

    if (!shipperId) {
      console.warn("No authenticated user found.");
      setLoading(false);
      return; 
    }

    const q = query(
      orderRef,
      where("orderStatusId", "in", ["5", "6", "7", "8"]),
      where("shipperId", "==", shipperId)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        //console.log("Orders snapshot Delivery:", snapshot.size);
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

  const handleCancelOrderPress = (orderId: React.SetStateAction<null>) => {
    setSelectedOrderId(orderId);
    setCancelModalVisible(true);
  };
  // const handleCancelOrder = async (orderId) => {
  //   try {
  //     const orderDocRef = doc(orderRef, orderId);
  //     await updateDoc(orderDocRef, {
  //       orderStatusId: "7",
  //     });
  //     console.log(
  //       `Order ${orderId} has been confirmed with shipper ID: ${shipperId}`
  //     );
  //   } catch (error) {
  //     console.error("Error confirming order:", error);
  //   }
  // };
 const handleCancelOrderConfirm = async () => {
   if (!cancelReason.trim()) {
     Alert.alert("Lý do hủy không được để trống.");
     return;
   }

   try {
     const orderDocRef = doc(orderRef, selectedOrderId);
     await updateDoc(orderDocRef, {
       orderStatusId: "7",
       cancelReason: cancelReason,
     });
     console.log(
       `Order ${selectedOrderId} has been cancelled with reason: ${cancelReason}`
     );
     setCancelModalVisible(false);
     setCancelReason("");
   } catch (error) {
     console.error("Error cancelling order:", error);
   }
 };
  const handleSuccess = async (orderId) => {
    try {
      const orderDocRef = doc(orderRef, orderId)
      await updateDoc(orderDocRef , {
        orderStatusId : "6"
      })
      setShowModal(true);

      // Ẩn modal sau 3 giây
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error success order:", error);
    }
  };
   const handleReturn = async (orderId) => {
    try {
      const orderDocRef = doc( orderRef, orderId)
      await updateDoc(orderDocRef, {
        orderStatusId : '8'
      })
    } catch (error) {
       console.error("Error return order:", error);
    }
   };
  const handlePress = (id) => {
    setExpandedId(id === expandedId ? null : id); // Toggle expand/collapse
  };

  const renderItem = ({ item }) => (
    <ItemComponent
      item={item}
      expanded={item.id === expandedId}
      onPress={() => handlePress(item.id)}
      handleCancelOrder={() => handleCancelOrderPress(item.id)}
      handleSuccess={handleSuccess}
      handleReturn={handleReturn}
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
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../../assets/images/deliverysuccess.png")}
              style={styles.image}
            />
            <Text style={styles.successText}>Giao hàng thành công!</Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isCancelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập lý do hủy..."
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={handleCancelOrderConfirm}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Delivery;

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
    backgroundColor: "#04CDC1",
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
  buttonCancel: {
    width: 68,
    height: 68,
    backgroundColor: "blue",
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  buttonSuccess: {
    width: 68,
    height: 68,
    backgroundColor: "green",
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  buttonReturn: {
    width: 68,
    height: 68,
    backgroundColor: "#FFD000",
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#04CDC1",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
