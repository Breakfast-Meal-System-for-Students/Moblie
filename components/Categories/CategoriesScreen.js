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
import { Platform } from "react-native";
const CategoriesScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const route = useRoute();
  const { categoryId } = route.params;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/RegisterCategory/all-product-by-category-id`,
        {
          params: {
            categoryId: categoryId,
            pageSize: 10,
            pageIndex: 1,
            isDesc: false,
          },
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (response.data.isSuccess) {
        setProducts(response.data.data.data); // Lấy danh sách sản phẩm từ phản hồi
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
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", {
          productId: item.product.id,
          cart: cart, // Truyền `cart` vào đây
          setCart: setCart, // Truyền `setCart` nếu cần chỉnh sửa `cart`
        })
      }
    >
      <View style={styles.productContainer}>
        <Image
          source={{
            uri:
              item.product.images.length > 0
                ? item.product.images[0].url
                : "https://via.placeholder.com/60",
          }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.productDistance}>
              {item.product.distance} km
            </Text>
            <Text style={styles.productRating}>
              ⭐ {item.product.rating} ({item.product.ratingCount})
            </Text>
          </View>
          <View style={styles.productPriceContainer}>
            <Text style={styles.productPrice}>
              ${item.product.price.toFixed(2)}
            </Text>
            <Text style={styles.productDeliveryFee}>
              🚚 ${item.product.deliveryFee}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: Platform.OS === "ios" ? 38 : 30,
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "100%",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
  },

  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    color: "#00cc69",
    fontWeight: "600",
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  productDistance: {
    fontSize: 14,
    color: "#555",
    marginRight: 10,
  },
  productRating: {
    fontSize: 14,
    color: "#ffa500",
  },
  productPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 15,
    color: "#00cc69",
    fontWeight: "600",
    marginRight: 10,
  },
  productDeliveryFee: {
    fontSize: 15,
    color: "#00cc69",
  },
});

export default CategoriesScreen;
