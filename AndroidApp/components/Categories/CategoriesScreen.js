import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productTouchable}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          productId: item.product.id,
          cart: cart,
          setCart: setCart,
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
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <View style={styles.productMeta}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {item.product.rating}</Text>
              <Text style={styles.ratingCount}>
                ({item.product.ratingCount})
              </Text>
            </View>
            <Text style={styles.productDistance}>
              📍 {item.product.distance} km
            </Text>
          </View>
          <View style={styles.productPriceContainer}>
            <Text style={styles.productPrice}>
              ${item.product.price.toFixed(2)}
            </Text>
            <View style={styles.deliveryContainer}>
              <Text style={styles.productDeliveryFee}>
                🚚 ${item.product.deliveryFee}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00cc69" />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
    paddingHorizontal: 16,
    backgroundColor: "#00cc69",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 8,
  },
  headerBackButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#00cc69",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  productList: {
    padding: 8,
  },
  productTouchable: {
    marginBottom: 12,
    marginHorizontal: 8,
  },
  productContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  productMeta: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#ffa500",
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "#666",
  },
  productDistance: {
    fontSize: 14,
    color: "#666",
  },
  productPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00cc69",
  },
  deliveryContainer: {
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 6,
  },
  productDeliveryFee: {
    fontSize: 14,
    color: "#666",
  },
});

export default CategoriesScreen;
