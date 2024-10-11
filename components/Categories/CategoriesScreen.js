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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category </Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: Platform.OS === "ios" ? 20 : 15,
    paddingHorizontal: 15,
    backgroundColor: "#00cc69",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: Platform.OS === "ios" ? 10 : 0,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
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
    marginHorizontal: 10,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default CategoriesScreen;
