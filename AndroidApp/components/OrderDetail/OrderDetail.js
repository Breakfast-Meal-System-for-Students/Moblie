import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";

export default function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const STATUS_TAKEN_OVER = 6;
  const STATUS_CANCEL = 7;

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderById/${orderId}`,
        {
          headers: { accept: "*/*", Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.isSuccess) {
        setOrderDetail(data.data);
      } else {
        Alert.alert("Error", "Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const handleOpenFeedback = async (orderId) => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/Feedback/CheckOrderIsFeedbacked?orderId=${orderId}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resBody = await response.json();
    if (resBody.data == true) {
      Alert.alert("You can only provide feedback once.");
    } else {
      navigation.navigate("CreateFeedback", { orderId });
    }
  };

  const changeOrderStatus = async (orderId, statusChange) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("User token is missing");

      const formData = new FormData();
      formData.append("id", orderId);
      formData.append("status", statusChange);

      const response = await fetch(
        "https://bms-fs-api.azurewebsites.net/api/Order/ChangeOrderStatus",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.messages[0]?.content || "Failed to change order status"
        );
      }
      
      Alert.alert("Success", data.messages[0].content.toString().trim(), [
        {
          text: "OK",
          onPress: () => fetchOrderDetail(),
        },
      ]);
    } catch (error) {
      console.error("Error changing order status:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancellation aborted"),
        },
        {
          text: "Yes",
          onPress: async () => {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(
              `https://bms-fs-api.azurewebsites.net/api/Order/CheckOrderIsPayed/${orderId}`,
              {
                method: "GET",
                headers: {
                  accept: "*/*",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const resBody = await response.json();
            if (resBody.data == false) {
              changeOrderStatus(orderId, STATUS_CANCEL);
            } else {
              Alert.alert("Order cancellation is not allowed.");
            }
          },
        },
      ],
      { cancelable: true } // Cho phép người dùng nhấn ra ngoài để đóng
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
      </View>
    );
  }

  if (!orderDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order details not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Details</Text>
      </View>

      <View style={styles.orderInfoContainer}>
        <Image source={{ uri: orderDetail.shopImage }} style={styles.shopImage} />
        <Text style={styles.title}>Order ID: {orderDetail.id}</Text>
        <Text>
        {" "}<Icon name="dollar" size={20} color="#000" />   Total Price:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(orderDetail.totalPrice || 0)}
        </Text>
        <Text>
            <Icon name="shopping-cart" size={20} color="#000" />  Shop Name: {orderDetail.shopName}
        </Text>
        <Text>

          <Icon name="calendar" size={20} color="#000" /> {" "}
          {orderDetail.orderDate ? (
            <>
              <Text style={styles.dateText}>
                {new Date(orderDetail.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
              {" "}
              <Ionicons name="time" size={20} color="#000" />{" "}
              <Text style={styles.timeText}>
                {new Date(orderDetail.orderDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </Text>
            </>
          ) : (
            "N/A"
          )}
        </Text>
        <Text style={styles.orderType}>
          <Icon name="users" size={20} color="#000" />{"  "}
          {orderDetail.isGroup ? "Group Order" : "Individual Order"}
        </Text>
        <Text style={styles.statusText}>
            <Icon name="info-circle" size={20} color="#ff6347" />
            {"  "}Status:{" "}
            <Text style={styles.statusValue}>{orderDetail.status}</Text>
        </Text>
      </View>

      {/* Products */}
      <FlatList
        data={orderDetail.orderItems}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              source={{ uri: item.productImages[0]?.url }}
              style={styles.productImage}
            />
            <View>
              <Text style={styles.productText}>Product: {item.productName}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price: {" "}
               {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(item.price || 0)}
                </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Buttons */}
      {orderDetail.status === "PREPARED" && (
          <TouchableOpacity
            style={styles.takeOverButton}
            onPress={() => changeOrderStatus(orderDetail.id, STATUS_TAKEN_OVER)}
          >
            <Text style={styles.buttonText}>Take Over</Text>
          </TouchableOpacity>
        )}
      {(orderDetail.status === 'ORDERED' || orderDetail.status === 'CHECKING') && (
          <TouchableOpacity
            style={[
              styles.actionButtonCancel,
              !orderDetail.canCancel && styles.disabledButton,
            ]}
            onPress={() => handleCancelOrder(orderDetail.id)}
            disabled={!orderDetail.canCancel}
          >
            <Text style={styles.buttonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
        {orderDetail.status === 'COMPLETE' && (
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              !orderDetail.canFeedback && styles.disabledButton,
            ]}
            onPress={() => handleOpenFeedback(orderDetail.id)}
            disabled={!orderDetail.canFeedback}
          >
            <Text style={styles.buttonText}>Feedback</Text>
          </TouchableOpacity>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    padding: 16,
  },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  orderInfoContainer: { padding: 16, backgroundColor: "white", marginBottom: 10 },
  title: { fontWeight: "bold", fontSize: 18 },
  productItem: { flexDirection: "row", marginVertical: 10 },
  productImage: { width: 60, height: 60, marginRight: 10 },
  productText: { fontWeight: "bold" },
  actionButton: {
    backgroundColor: "#00cc69",
    margin: 10,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  actionButtonCancel: {
    backgroundColor: "red",
    margin: 10,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "bold" },
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.6,
  },
  takeOverButton: {
    backgroundColor: "#ff9800",
    marginTop: 10,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  feedbackButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  orderType: {
    marginTop: 5,
    fontStyle: "italic",
    fontSize: 14,
  },
  shopImage: {
    alignItems: "center",
    width: 381,
    height: 200,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 20,          // Tăng kích thước chữ
    fontWeight: "bold",    // Chữ đậm
    color: "#ff6347",      // Màu cam nổi bật
    marginVertical: 10,    // Khoảng cách trên/dưới
    textAlign: "center",   // Canh giữa dòng
    backgroundColor: "#fffbe6", // Màu nền vàng nhạt nổi bật
    borderRadius: 8,       // Bo góc nền
    padding: 10,           // Tạo padding cho chữ và icon
    shadowColor: "#000",   // Tạo bóng nhẹ
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,          // Bóng trên Android
  },
  statusValue: {
    color: "#000",         // Màu chữ đen hoặc có thể để màu khác
    fontSize: 22,          // Kích thước chữ lớn hơn
    fontWeight: "bold",    // Đậm
  },  
});
