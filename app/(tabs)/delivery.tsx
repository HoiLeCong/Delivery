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
import {
  auth,
  db,
  deliveryHistoryRef,
  orderHistoryRef,
  orderRef,
} from "@/src/firebase/firebaseConfig";
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
import axios from "axios";
const API_BASE_URL = "https://https-github-com-nguyenquoctien15-rn.onrender.com";
type ItemComponentProps = {
  item: any;
  onPress: () => void;
  expanded: boolean;
  handlePayTheShop: (orderId: string) => void;
  handleReturn: (orderId: string) => void;
  handleActionsSucceedAndNotification: {
    handleSucceed: (orderId: string) => Promise<void>;
    updateOrderStatusSuccess: (orderId: string) => Promise<void>;
  };
  handleActionsCancelAndNotification: {
    updateOrderStatusFail: (orderId: string) => Promise<void>;
    handleCancelOrderConfirm: (orderId: string) => Promise<void>;
    handleCancelOrderPress: (orderId: string) => void;
  };
};

const ItemComponent = ({
  item,
  onPress,
  expanded,
  handlePayTheShop,
  handleReturn,
  handleActionsSucceedAndNotification,
  handleActionsCancelAndNotification,
}: any) => {
  const { handleSucceed, updateOrderStatusSuccess } =
    handleActionsSucceedAndNotification;
  const orderSucceedAndSendStatus = async () => {
    await handleSucceed(item.id);
    await updateOrderStatusSuccess(item.id);
  };
  const {
    updateOrderStatusFail,
    handleCancelOrderConfirm,
    handleCancelOrderPress,
  } = handleActionsCancelAndNotification;
  const orderFailAndSendStatusFail = async () => {
    await handleCancelOrderPress(item.id);
    await handleCancelOrderConfirm(item.id);
    await updateOrderStatusFail(item.id);
  };
  const baseHeight = 140;
  const maxExpandedHeight = 500;
  const calculatedHeight = baseHeight + item.productNames.length * 30;

  const animatedHeight = useState(new Animated.Value(baseHeight))[0];

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded
        ? Math.min(calculatedHeight, maxExpandedHeight)
        : baseHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, item.productNames.length]);

  const getBackgroundColor = () => {
    switch (item.orderStatusId) {
      case "5":
        return "#04CDC1";
      case "6":
        return "#04CD18";
      case "7":
        return "red";
      case "8":
        return "#CEBA08";
      case "9":
        return "#ff7891";
      default:
        return "#fff";
    }
  };
  const OrderStatus = {
    IN_TRANSIT: "5",
    DELIVERED: "6",
    FAILED: "7",
    RETURNED: "8",
  };
  const renderStatusButtons = () => {
    switch (item.orderStatusId) {
      case OrderStatus.IN_TRANSIT:
        return (
          <>
            <TouchableOpacity
              style={styles.buttonCancel}
              //@ts-ignore
              //nút nhấn thất bại
              onPress={() => orderFailAndSendStatusFail(item.id)}
              //nút nhấn thất bại
            >
              <Text style={styles.buttonText}>Thất{"\n"}bại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSuccess}
              //nút nhấn thành công
              //@ts-ignore
              onPress={() => orderSucceedAndSendStatus(item.id)}
              //nút nhấn thành công
            >
              <Text style={styles.buttonText}>Thành công</Text>
            </TouchableOpacity>
          </>
        );
      case OrderStatus.DELIVERED:
        return (
          <TouchableOpacity
            style={styles.buttonPay}
            onPress={() => handlePayTheShop(item.id)}
          >
            <Text style={styles.buttonText}>Trả{"\n"}tiền</Text>
          </TouchableOpacity>
        );
      case OrderStatus.FAILED:
        return (
          <TouchableOpacity
            style={styles.buttonReturn}
            onPress={() => handleReturn(item.id)}
          >
            <Text style={styles.buttonText}>Lưu{"\n"}kho</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Animated.View
          style={[styles.itemContainer, { height: animatedHeight }]}
        >
          <View
            style={[
              styles.itemOrderFlatList,
              { backgroundColor: getBackgroundColor() },
            ]}
          >
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
                {item.orderStatusId == 7 && (
                  <View style={styles.itemLineOrderFlatList}>
                    <Text style={styles.title}>Ghi chú:</Text>
                    <Text style={styles.contentTitle}>{item.cancelReason}</Text>
                  </View>
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
                  {renderStatusButtons()}
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
  const shipperId = auth.currentUser?.uid;

  useEffect(() => {
    const shipperId = auth.currentUser?.uid;

    if (!shipperId) {
      console.warn("No authenticated user found.");
      setLoading(false);
      return;
    }

    const q = query(
      orderRef,
      where("orderStatusId", "in", ["5", "6", "7", "8", "9"]),
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
                .map((item: { title: any }) => item.title)
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

  /**
   * Ham huy don do giao hàng thất bại
   * @param orderId
   */
  const handleCancelOrderPress = (orderId: React.SetStateAction<null>) => {
    setSelectedOrderId(orderId);
    setCancelModalVisible(true);
  };

  const handleCancelOrderConfirm = async () => {
    if (!cancelReason.trim()) {
      Alert.alert("Lý do hủy không được để trống.");
      return;
    }

    try {
      const orderDocRef = doc(orderRef, selectedOrderId);
      const orderSnapshot = await getDoc(orderDocRef);

      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();

        await updateDoc(orderDocRef, {
          orderStatusId: "7",
          cancelReason: cancelReason,
        });

        const userId = orderData.userId;
        const orderHistoryDocRef = doc(
          collection(orderHistoryRef, userId, "userOrders"),
          selectedOrderId
        );

        await setDoc(orderHistoryDocRef, {
          ...orderData,
          orderStatusId: "7",
          cancelReason: cancelReason,
        });

        const deliveryHistoryDocRef = doc(
          deliveryHistoryRef,
          shipperId,
          "orders",
          selectedOrderId
        );
        await setDoc(deliveryHistoryDocRef, {
          ...orderData,
          orderStatusId: "7",
          cancelReason: cancelReason,
        });
  // Gọi API thông báo trạng thái đơn hàng
          //@ts-ignore
          await updateOrderStatusFail(orderId, shipperId, "Giao thất bại", "nd");
          console.log(updateOrderStatusFail)
        console.log(
          `Order ${selectedOrderId} has been canceled and moved to orderHistory.`
        );
        setCancelModalVisible(false);
        setCancelReason("");
      } else {
        console.log("Order not found.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };
  //ham huy don hang

  /**
   * //goi api thong bao tinh trang don hang giao that bai
   * @param orderId
   * @param shipperId
   * @param status
   */
  //@ts-ignore
  // Define the updateOrderStatusFail function
const updateOrderStatusFail = async (orderId: string) => {
  try {
    // Send failure status to the backend or process it accordingly
    const response = await axios.post(`${API_BASE_URL}/orders/update-status`, {
      orderId,
      status: "Failed",  // Example failure status
    });

    if (response.data.success) {
      console.log(`Order ${orderId} status updated to Failed.`);
    } else {
      console.error("Error from server:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

  
  //goi api thong bao tinh trang don hangr
  /**
   * //goi api thong bao tinh trang don hang
   * @param orderId
   * @param shipperId
   * @param status
   */
  //@ts-ignore
  const updateOrderStatusSuccess = async (orderId, shipperId, status, reason = "") => {
    console.log("orderId:", orderId);
  console.log("shipperId:", shipperId);
  console.log("status:", status);
    if (!shipperId || !status) {
      console.error("Missing shipperId or status.");
      return;  // Prevent sending the request if the required fields are missing
    }
  
    // Khởi tạo payload cơ bản với orderId, shipperId và status
    const payload = { orderId, shipperId, status, reason };
    console.log("Payload being sent:", payload);  // Log payload for debugging
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/shipper-assigned`,
        payload
      );
  
      if (response.data.success) {
        console.log("Order status updated successfully");
      } else {
        console.error("Error from server:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  //goi api thong bao tinh trang don hang that bai

  /**
   * //ham xu li shipper giao hang thanh cong cho client
   * @param orderId
   */
  const handleSucceed = async (orderId: string | undefined) => {
    try {
      const orderDocRef = doc(orderRef, orderId);
      const orderSnapshot = await getDoc(orderDocRef);

      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        await updateDoc(orderDocRef, {
          orderStatusId: "6",
        });

        const userId = orderData.userId;
        const orderHistoryDocRef = doc(
          orderHistoryRef,
          userId,
          "userOrders",
          orderId
        );

        await setDoc(orderHistoryDocRef, {
          ...orderData,
          orderStatusId: "6",
        });
       
        //@ts-ignore
        const deliveryHistoryDocRef = doc(
          deliveryHistoryRef,
          shipperId,
          "orders",
          orderId
        );
        await setDoc(deliveryHistoryDocRef, {
          ...orderData,
          orderStatusId: "6",
        });
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
 // Gọi API thông báo trạng thái đơn hàng
        //@ts-ignore
        await updateOrderStatusSuccess(
          orderId,
          shipperId,
          "Giao hàng thành công",
          "nfd"
         
        );
        console.log(updateOrderStatusSuccess);
        console.log("Order updated and moved to orderHistory as delivered.");
      } else {
        console.log("Order not found.");
      }
    } catch (error) {
      console.error("Error success order:", error);
    }
  };
  //ham xu li khi shipper giao hang thanh cong choo client

  /**
   * hàm trả tiền cho shop (admin)
   * @param orderId
   */
  const handlePayTheShop = async (orderId: string | undefined) => {
    try {
      const orderDocRef = doc(orderRef, orderId);
      await updateDoc(orderDocRef, {
        orderStatusId: "9",
      });
    } catch (error) {
      console.error("Error pay the shop order:", error);
    }
  };

  /**
   * Hàm trả hàng lại kho
   * @param orderId
   */
  const handleReturn = async (orderId: string | undefined) => {
    try {
      const orderDocRef = doc(orderRef, orderId);
      await updateDoc(orderDocRef, {
        orderStatusId: "8",
      });
    } catch (error) {
      console.error("Error return order:", error);
    }
  };
  const handlePress = (id) => {
    setExpandedId(id === expandedId ? null : id); // Toggle expand/collapse
  };

  const renderItem = ({ item }: any) => (
    <ItemComponent
      item={item}
      expanded={item.id === expandedId}
      onPress={() => handlePress(item.id)}
      handleActionsSucceedAndNotification={{
        handleSucceed,
        updateOrderStatusSuccess,
      }}
      handleActionsCancelAndNotification={{
        updateOrderStatusFail,
        handleCancelOrderConfirm,
        handleCancelOrderPress,
      }}
      handleReturn={handleReturn}
      handlePayTheShop={handlePayTheShop}
    />
  );

  /**
   * Xử lí lý do hủy hàng
   */
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
            <Text style={styles.modalTitle}>Lý do giao thất bại</Text>
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
  /**
   * Xử lí lý do hủy hàng
   */
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
  buttonHandOver: {
    width: 68,
    height: 68,
    backgroundColor: "#04CDC1",
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
  buttonPay: {
    width: 68,
    height: 68,
    backgroundColor: "#04CDC1",
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
