import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CategoriesScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { categoryId } = route.params;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/RegisterCategory/all-product-by-category-id?categoryId=${categoryId}&pageSize=4`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
      if (response.data.isSuccess) {
        setProducts(response.data.data.data);
      } else {
        setError("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{
          uri:
            item.product.images.length > 0
              ? item.product.images[0]
              : "placeholder-uri",
        }}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          ${item.product.price.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.productQuantity}>{item.product.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00cc69",
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ffffff", // Màu nền cho nút back
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Tạo bo góc cho nút back
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // Hiệu ứng nổi
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#003366",
    fontWeight: "600", // Tăng độ đậm cho text back
  },
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#ffffff", // Màu nền trắng cho container
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Hiệu ứng nổi nhẹ
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10, // Bo góc hình ảnh
  },
  productDetails: {
    flex: 1,
    marginLeft: 15, // Khoảng cách giữa hình ảnh và thông tin sản phẩm
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Màu chữ tối hơn cho tên sản phẩm
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    color: "#00cc69", // Màu xanh dịu hơn cho giá
    fontWeight: "600", // Tăng độ đậm cho giá
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", // Màu xám cho số lượng
  },
});

export default CategoriesScreen;
