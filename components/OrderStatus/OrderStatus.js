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
  Platform,
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
  const [status, setStatus] = useState(1); // Default to ORDERED
  const [search, setSearch] = useState("");
  const [isDesc, setIsDesc] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigation = useNavigation();

  const statusLabels = [
    { id: 1, label: "Draft", value: "DRAFT" },
    { id: 2, label: "Ordered", value: "ORDERED" },
    { id: 3, label: "Checking", value: "CHECKING" },
    { id: 4, label: "Preparing", value: "PREPARING" },
    { id: 5, label: "Prepared", value: "PREPARED" },
    { id: 6, label: "Taken Over", value: "TAKENOVER" },
    { id: 7, label: "Cancelled", value: "CANCEL" },
    { id: 8, label: "Complete", value: "COMPLETE" },
  ];

  const fetchOrders = async (selectedStatus) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("User token is missing");
      }

      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderForUser?search=${search}&isDesc=${isDesc}&pageIndex=${pageIndex}&pageSize=${pageSize}&status=${selectedStatus}`,
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
    fetchOrders(status);
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
          style={styles.reorderButton}
          onPress={() => toggleOrderProducts(item.id)}
        >
          <Text style={styles.buttonText}>View Products</Text>
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

  const renderStatusTab = ({ item }) => (
    <TouchableOpacity
      style={[styles.tabButton, status === item.id && styles.activeTab]}
      onPress={() => setStatus(item.id)}
    >
      <Text style={styles.tabText}>{item.label}</Text>
    </TouchableOpacity>
  );

  if (loading && pageIndex === 1) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        horizontal
        data={statusLabels}
        renderItem={renderStatusTab}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      />

      <FlatList
        data={orders}
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
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#00cc69",
    marginTop: Platform.OS === "ios" ? 44 : 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  horizontalScroll: {
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40, // Giảm chiều cao
    maxHeight: 50, // Đặt giới hạn chiều cao nếu cần
  },

  tabButton: {
    paddingVertical: 12, // Increased padding for a better touch area
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    marginHorizontal: 8, // Adjusted spacing between the tabs
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#00cc69",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 12,
  },
  reorderButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 15,
    color: "#888",
    fontSize: 16,
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productDetails: {
    marginLeft: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
