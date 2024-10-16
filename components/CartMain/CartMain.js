import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartMain = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(6);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/GetAllCartForUser?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.isSuccess) {
        setCartData(data.data.data);
      } else {
        setError(data.messages[0]?.content || "Failed to fetch cart data");
      }
    } catch (error) {
      setError("An error occurred while fetching cart data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.shopId}>Shop ID: {item.shopId}</Text>
      <Text style={styles.cartId}>Cart ID: {item.id}</Text>
      <Text style={styles.isGroup}>
        Cart Type: {item.isGroup ? "Group" : "Individual"}
      </Text>
      <FlatList
        data={item.cartDetails}
        renderItem={renderCartDetail}
        keyExtractor={(detail) => detail.id}
      />
    </View>
  );

  const renderCartDetail = ({ item }) => (
    <View style={styles.cartDetail}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
        <Text style={styles.loadingText}>Loading cart data...</Text>
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error);
    return null;
  }

  return (
    <FlatList
      data={cartData}
      renderItem={renderCartItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>No items in the cart.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
  cartItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  shopId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cartId: {
    fontSize: 14,
    color: "#555",
  },
  isGroup: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  cartDetail: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#00cc69",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productQuantity: {
    fontSize: 14,
    color: "#555",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});

export default CartMain;
