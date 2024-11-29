import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartGroupScreen = ({ route, navigation }) => {
  const { cartId } = route.params; // Nhận cartId từ params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Cart/GetCartBySharing/${cartId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.isSuccess) {
          setProducts(response.data.data.products); // Giả sử API trả về danh sách sản phẩm
        } else {
          Alert.alert("Error", "Failed to fetch cart products.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "An error occurred while fetching cart products.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cartId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products in Group Cart</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} ₫</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.errorText}>No products available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#e74c3c",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default CartGroupScreen;
