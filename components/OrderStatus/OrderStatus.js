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
  Platform, // Import Platform here
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [isLastPage, setIsLastPage] = useState(false);
  const [status, setStatus] = useState(0); // 0 for Pending, 1 for History
  const [search, setSearch] = useState("");
  const [isDesc, setIsDesc] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("User token is missing");
      }

      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderForUser?search=${search}&isDesc=${isDesc}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
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
    fetchOrders();
  }, [pageIndex, status, search, isDesc]);

  const loadMoreOrders = () => {
    if (!isLastPage) {
      setPageIndex((prevPage) => prevPage + 1);
    }
  };

  const toggleOrderProducts = (orderId) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const goToProductDetail = (productId) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Image source={{ uri: item.shopImage }} style={styles.shopImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Total Price: ${item.totalPrice.toFixed(2)}</Text>
        <Text>Shop Name: {item.shopName}</Text>
        <Text>
          Customer: {item.firstName} {item.lastName}
        </Text>
        <Text>
          Order Date:{" "}
          {item.orderDate
            ? new Date(item.orderDate).toLocaleDateString()
            : "N/A"}
        </Text>

        <TouchableOpacity
          style={
            item.status === "Pending"
              ? styles.cancelButton
              : styles.reorderButton
          }
          onPress={() => toggleOrderProducts(item.id)}
        >
          <Text style={styles.buttonText}>
            {item.status === "Pending" ? "Cancel" : "Re-order"}
          </Text>
        </TouchableOpacity>

        {expandedOrderId === item.id && (
          <View style={styles.productList}>
            {item.orderItems.map((orderItem) => (
              <TouchableOpacity
                key={`${orderItem.id}-${orderItem.productId}`}
                style={styles.productItem}
                onPress={() => goToProductDetail(orderItem.productId)}
              >
                <Image
                  source={{ uri: orderItem.productImages[0]?.url }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>
                    Product: {orderItem.productName}
                  </Text>
                  <Text>Quantity: {orderItem.quantity}</Text>
                  <Text>Price: ${orderItem.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (loading && pageIndex === 1) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Status</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, status === 0 && styles.activeTab]}
          onPress={() => setStatus(0)} // Pending
        >
          <Text style={styles.tabText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, status === 1 && styles.activeTab]}
          onPress={() => setStatus(1)} // History
        >
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders.filter((order) =>
          status === 0
            ? order.status === "Pending"
            : order.status === "Completed"
        )}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          !isLastPage && <ActivityIndicator size="small" color="#00cc69" />
        }
        ListEmptyComponent={() => (
          <Text style={styles.noOrdersText}>No orders found</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#00cc69",
    marginTop: Platform.OS === "ios" ? 59 : 20, // Adjust for iOS
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#00cc69",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reorderButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
