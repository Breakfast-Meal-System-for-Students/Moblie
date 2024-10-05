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
        <TouchableOpacity style={styles.buttonContainer}>
          <View style={styles.iconTextContainer}>
            <Image
              source={{
                uri: "https://i.pinimg.com/564x/e1/3e/03/e13e03f278ccc0d67cbeccc3a1a76e42.jpg",
              }}
              style={styles.icon}
            />

            <Text style={styles.buttonText}>Đặt đơn nhóm</Text>
          </View>
        </TouchableOpacity>
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
          <Text style={styles.productDetailsText}>4.8 (1.2k reviews)</Text>
        </View>
        <View style={styles.productDetailsRow}>
          <FontAwesome name="map-marker" size={18} color="#00cc69" />
          <Text style={styles.productDetailsText}>2.4 Km</Text>
          <Text style={styles.productDetailsText}> | Deliver Now | $ 2.00</Text>
        </View>
        <Text style={styles.productDetailsText}>
          {shopDetails.description || "No description available."}
        </Text>
        <View style={styles.productDetailsRow}>
          <FontAwesome name="tag" size={18} color="#00cc69" />
          <Text style={styles.productDetailsText}>Offers are available</Text>
        </View>
      </View>
    </View>
  );

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#00cc69",
  },
  backButton: {
    padding: 10,
  },
  shopName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cartItemCount: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
  },
  shopImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  productDescriptionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  productDetailsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  productsSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#ff7a00",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
  },
});
