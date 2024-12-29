import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { io } from 'socket.io-client';

export default function OrderStatus() {
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [isLastPage, setIsLastPage] = useState(false);
  const [status, setStatus] = useState(2);
  const [search, setSearch] = useState("");
  const [isDesc, setIsDesc] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigation = useNavigation();
  const STATUS_TAKEN_OVER = 6;
  const STATUS_CANCEL = 7;

  const statusLabels = [
    
    { id: 2, label: "Ordered", value: "ORDERED" },
    { id: 3, label: "Checking", value: "CHECKING" },
    { id: 4, label: "Preparing", value: "PREPARING" },
    { id: 5, label: "Prepared", value: "PREPARED" },
    { id: 6, label: "Taken Over", value: "TAKENOVER" },
    { id: 7, label: "Cancelled", value: "CANCEL" },
    { id: 8, label: "Complete", value: "COMPLETE" },
  ];

  const fetchOrders = async (newPageIndex = 1, selectedStatus = status) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("User token is missing");

      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderForUser?search=${search}&isDesc=${isDesc}&pageIndex=${newPageIndex}&pageSize=${pageSize}&status=${selectedStatus}`,
        { headers: { accept: "*/*", Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.messages[0]?.content || "Failed to fetch orders"
        );
      }

      const data = await response.json();
      if (data.isSuccess) {
        setOrders(data.data.data);
        setIsLastPage(data.data.isLastPage);
      } else {
        console.error("Error fetching orders:", data.messages);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageIndex, status);
    const socketConnection = io('https://bms-socket.onrender.com');
    setSocket(socketConnection);

    return () => {
      setTimeout(() => {
        socketConnection.disconnect(); // Delay disconnect by 2 seconds
      }, 2000); // 2 seconds delay
    };
  }, [pageIndex, status, search, isDesc]);

  const loadMoreOrders = () => {
    if (!isLastPage) {
      const nextPage = pageIndex + 1;
      setPageIndex(nextPage);
      fetchOrders(nextPage, status);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      const previousPage = pageIndex - 1;
      setPageIndex(previousPage);
      fetchOrders(previousPage, status);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPageIndex(1);
    fetchOrders(1, newStatus);
  };

  const toggleOrderProducts = (orderId) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const sendNotiToShop = async (orderId, userId, shopId) => {
    if (socket) {
      socket.emit('join-shop-topic', shopId);
      const orderData = {
        userId,
        shopId,
        orderId,
      };
      socket.emit('new-order', orderData); // Send notification to shop
    }
  };

  const fetchOrderById = async (orderId) => {
    console.log("fetchOrderById");
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Order/GetOrderById/${orderId}`, {
      method: 'GET',
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`
      },
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      const order = resBody.data;
      sendNotiToShop(order.id, order.customerId, order.shopId)
    } else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  }

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
      fetchOrderById(orderId);
      Alert.alert("Success", data.messages[0].content.toString().trim(), [
        {
          text: "OK",
          onPress: () => fetchOrders(pageIndex, status), // Tải lại dữ liệu sau khi nhấn OK
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
            changeOrderStatus(orderId, STATUS_CANCEL);
          },
        },
      ],
      { cancelable: true } // Cho phép người dùng nhấn ra ngoài để đóng
    );
  }

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

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Image source={{ uri: item.shopImage }} style={styles.shopImage} />
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
      >
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle}>
          <Icon name="file-text" size={20} color="#000" /> Order ID: {item.id}
        </Text>
        <Text>
          <Icon name="info-circle" size={20} color="#000" /> Status:{" "}
          {item.status}
        </Text>
        <Text>
          <Icon name="dollar" size={20} color="#000" /> Total Price:{" "}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(item.totalPrice || 0)}
        </Text>
        <Text>
          <Icon name="shopping-cart" size={20} color="#000" /> Shop Name:{" "}
          {item.shopName}
        </Text>
        <Text>
          <Icon name="user" size={20} color="#000" /> Customer: {item.firstName}{" "}
          {item.lastName}
        </Text>
        <Text>

          <Icon name="calendar" size={20} color="#000" /> {" "}
          {item.orderDate ? (
            <>
              <Text style={styles.dateText}>
                {new Date(item.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
              {" "}
              <Ionicons name="time" size={20} color="#000" />{" "}
              <Text style={styles.timeText}>
                {new Date(item.orderDate).toLocaleTimeString("en-US", {
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

        {/* Show if the order is group or individual */}
        <Text style={styles.orderType}>
          <Icon name="users" size={20} color="#000" />{" "}
          {item.isGroup ? "Group Order" : "Individual Order"}
        </Text>

        {status == 8 && (
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              !item.canFeedback && styles.disabledButton,
            ]}
            onPress={() => handleOpenFeedback(item.id)}
            disabled={!item.canFeedback}
          >
            <Text style={styles.buttonText}>Feedback</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => toggleOrderProducts(item.id)}
        >
          <Text style={styles.buttonText}>View Products</Text>
        </TouchableOpacity>

        {status <= 3 && (
          <TouchableOpacity
            style={[
              styles.cancelButton,
              !item.canCancel && styles.disabledButton,
            ]}
            onPress={() => handleCancelOrder(item.id)}
            disabled={!item.canCancel}
          >
            <Text style={styles.buttonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}

        {expandedOrderId === item.id && (
          <View style={styles.productList}>
            {item.orderItems.map((orderItem) => (
              <TouchableOpacity
                key={`${orderItem.id}-${orderItem.productId}`}
                style={styles.productItem}
              >
                <Image
                  source={{ uri: orderItem.productImages[0]?.url }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>
                    Product: {orderItem.productName}
                  </Text>
                  <Text> Quantity: {orderItem.quantity}</Text>
                  <Text>
                    <Icon name="" size={20} color="#000" /> Total Price:{" "}
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(orderItem.quantity * orderItem.price || 0)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {item.status === "PREPARED" && (
          <TouchableOpacity
            style={styles.takeOverButton}
            onPress={() => changeOrderStatus(item.id, STATUS_TAKEN_OVER)}
          >
            <Text style={styles.buttonText}>Take Over</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order</Text>
      </View>

      <FlatList
        horizontal
        data={statusLabels}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tabButton, status === item.id && styles.activeTab]}
            onPress={() => handleStatusChange(item.id)}
          >
            <Text style={styles.tabText}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.statusTabs}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreOrders}
            onEndReachedThreshold={0}
            ListFooterComponent={
              !isLastPage && !loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : null
            }
          />

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={handlePreviousPage}
              disabled={pageIndex <= 1}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>Page {pageIndex}</Text>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={loadMoreOrders}
              disabled={isLastPage}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statusTabs: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginRight: 10,
    height: 40,
  },
  activeTab: {
    backgroundColor: "#00cc69",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  orderCard: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  shopImage: {
    marginLeft: 10,
    marginBottom: 5,
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  orderInfo: {
    marginLeft: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderType: {
    marginTop: 5,
    fontStyle: "italic",
    fontSize: 14,
  },
  reorderButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 8,
    marginTop: 10,
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
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  productList: {
    marginTop: 10,
    marginLeft: 20,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productDetails: {
    marginLeft: 10,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  takeOverButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  pageButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  pageButtonText: {
    color: "white",
  },
  pageText: {
    fontSize: 16,
    alignSelf: "center",
  },
  loading: {
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.6,
  },

  detailButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 10, // Đảm bảo nằm trên cùng
  },
  detailButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },  
});
