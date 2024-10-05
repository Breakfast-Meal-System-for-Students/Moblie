import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (userId, pageIndex = 1, pageSize = 3) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/Order/GetListOrders`,
        {
          params: { userId, pageIndex, pageSize },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      if (response.data.isSuccess) {
        setOrders(response.data.data.data);
      } else {
        setError("Failed to fetch orders.");
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setError(error.response.data.detail || "An error occurred");
      } else {
        setError("An error occurred while fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = "56311396-3594-44e7-9d37-12c3391994ad";
    fetchOrders(userId);
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderText}>
          Order ID: <Text style={styles.boldText}>{item.id}</Text>
        </Text>
        <Text style={styles.orderText}>
          Total Price:{" "}
          <Text style={styles.boldText}>${item.totalPrice.toFixed(2)}</Text>
        </Text>
        <View style={styles.orderStatus}>
          <Text style={styles.boldText}>
            Status:{" "}
            <Text
              style={
                item.status === "Completed"
                  ? styles.orderCompleted
                  : styles.orderCancelled
              }
            >
              {item.status}
            </Text>
          </Text>
        </View>
        <Text style={styles.orderText}>
          Shop ID: <Text style={styles.boldText}>{item.shopId}</Text>
        </Text>
        {item.orderItems.length > 0 ? (
          <Text style={styles.orderText}>
            Order Items:{" "}
            <Text style={styles.boldText}>{item.orderItems.length}</Text>
          </Text>
        ) : (
          <Text style={styles.orderText}>No items in this order.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.reOrderButton}>
        <Text style={{ color: "#fff" }}>Re-Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00cc69" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
        />
      )}
      <Button
        title="Refresh"
        onPress={() => fetchOrders("56311396-3594-44e7-9d37-12c3391994ad")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDetails: {
    flex: 2,
  },
  reOrderButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  orderPrice: {
    color: "#ff5f5f",
    fontWeight: "bold",
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderCancelled: {
    color: "red",
  },
  orderCompleted: {
    color: "#00cc69",
  },
});

export default OrderStatus;
