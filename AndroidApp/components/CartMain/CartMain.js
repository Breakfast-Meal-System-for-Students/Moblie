import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
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
      <Text style={styles.shopId}>🛍️ Shop ID: {item.shopId}</Text>
      <Text style={styles.cartId}>🛒 Cart ID: {item.id}</Text>
      <Text style={styles.isGroup}>
        📦 Cart Type: {item.isGroup ? "Group" : "Individual"}
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
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.productName}>📦 {item.name}</Text>
      <Text style={styles.productQuantity}>🔢 Quantity: {item.quantity}</Text>
      
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://example.com/your-image-url.png" }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>🛒 Your Shopping Cart</Text>
      </View>
      <FlatList
        data={cartData}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in the cart.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#00cc69",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#00cc69",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Nếu muốn thêm logo hoặc hình ảnh khác
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
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
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  shopId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cartId: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  isGroup: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  cartDetail: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#00cc69",
    flexDirection: "column", // Cập nhật thành column
    alignItems: "flex-start", // Cập nhật căn lề trái
    marginBottom: 10, // Thêm khoảng cách dưới cùng cho mỗi chi tiết giỏ hàng
  },
  productImage: {
    width: 60, // Điều chỉnh kích thước hình ảnh nếu cần
    height: 60,
    marginBottom: 5, // Thêm khoảng cách dưới hình ảnh
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5, // Thêm khoảng cách dưới tên sản phẩm
  },
  productQuantity: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5, // Thêm khoảng cách dưới số lượng
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5, // Thêm khoảng cách dưới giá
  },
});
export default CartMain;
