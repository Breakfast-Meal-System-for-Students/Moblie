import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function ShopScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [cart, setCart] = useState({});
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const goToProductDetail = (item) => {
    navigation.navigate("ProductDetail", { productId: item.id });
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: currentQuantity + 1,
        },
      };
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      if (currentQuantity > 0) {
        return {
          ...prevCart,
          [product.id]: {
            product,
            quantity: currentQuantity - 1,
          },
        };
      }
      return prevCart;
    });
  };

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setShopDetails(data.data);
          await AsyncStorage.setItem("shopId", id);
        } else {
          console.error("Error fetching shop details:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Product/all-product-by-shop-id?id=${id}&pageIndex=1&pageSize=5`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setProducts(data.data.data);
        } else {
          console.error("Error fetching products:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
    fetchProducts();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  if (!shopDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Shop details are not available.</Text>
      </View>
    );
  }

  const renderShopDetails = () => (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.shopName}>
          {shopDetails.name || "Shop Name Not Available"}
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Checkout", { cart })}
        >
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
          <Text style={styles.cartItemCount}>
            {Object.keys(cart).reduce(
              (total, key) => total + cart[key].quantity,
              0
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri:
            shopDetails.image ||
            "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
        }}
        style={styles.shopImage}
      />
      <View style={styles.productDescriptionContainer}>
        <Text style={styles.productName}>{shopDetails.name}</Text>
        <View style={styles.productDetailsRow}>
          <FontAwesome name="star" size={18} color="#f1c40f" />
          <Text style={styles.productDetailsText}>4.8 </Text>

          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => navigation.navigate("Feedback", { shopId: id })}
          >
            <Text style={styles.feedbackButtonText}>(10+ Bình luận)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        ListHeaderComponent={renderShopDetails}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productItem}
            onPress={() => goToProductDetail(item)}
          >
            <Image
              source={{
                uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
              }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.name || "Unnamed Product"}
              </Text>
              <Text style={styles.productPrice}>${item.price || 0}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.errorText}>No products available.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Platform.OS === "ios" ? 15 : 9,
    paddingHorizontal: 10,
    backgroundColor: "#00cc69",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButton: {
    padding: 10,
  },
  shopName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  cartButton: {
    position: "relative",
    padding: 10,
  },
  cartItemCount: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 20,
    minHeight: 20,
  },
  shopImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  productDescriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  productDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  productDetailsText: {
    marginLeft: 9,
    fontSize: 16,
    color: "#7f8c8d",
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  feedbackButton: {
    marginLeft: 10,
  },
  feedbackButtonText: {
    color: "#FFB90F",
    fontSize: 14,
  },
});
