import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShoppingCart,
  faArrowLeft,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
const goToProductDetail = async (item) => {
  navigation.navigate("ProductDetail", { productId: item.id });
};
const { width } = Dimensions.get("window");

export default function ShopScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route.params); // Check what params are being passed
  const { id } = route.params || {}; // Use default empty object to avoid errors
  const [cart, setCart] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const flatListRef = useRef(null);
  const goToProductDetail = async (item) => {
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
          console.error("Error fetching shop details:", data.data);
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
        console.log("Products API Response:", data); // Log the response
        if (data.isSuccess) {
          setProducts(data.data.data); // Set the products from the response
        } else {
          console.error("Error fetching products:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchShopDetails();
    fetchProducts();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Shop ID is not available.</Text>
      </View>
    );
  }

  // Check if shopDetails is available before rendering

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.shopName}>{shopDetails.name}</Text>
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

      <View style={styles.carouselContainer}>
        <FlatList
          data={shopDetails.products}
          renderItem={({ item }) => (
            <ProductCard
              product={{
                ...item,
                name: item.name || "Unnamed Product",
                description: item.description || "No description available.",
                image: item.image || "https://via.placeholder.com/150", // Default image
                address: item.address || "Address not available",
                rate: item.rate || 0,
                email: item.email || "No email provided",
              }}
              addToCart={addToCart}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

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
        <Text style={styles.productDetailsText}>{shopDetails.description}</Text>
        <View style={styles.productDetailsRow}>
          <FontAwesome name="tag" size={18} color="#00cc69" />
          <Text style={styles.productDetailsText}>Offers are available</Text>
        </View>
      </View>
      {/* 
      <View style={styles.offersSection}>
        <Text style={styles.sectionTitle}>Near by Offer</Text>
        <FlatList
          data={offers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.offerItem}>
              <Image source={{ uri: item.image }} style={styles.offerImage} />
              <Text style={styles.offerText}>{item.discount}</Text>
            </View>
          )}
        />
      </View> */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Products</Text>
        {products.length === 0 ? (
          <Text style={styles.errorText}>No products available.</Text>
        ) : (
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productItem}
                onPress={() => goToProductDetail(item)}
              >
                <Image
                  source={{
                    uri:
                      item.images[0]?.url || "https://via.placeholder.com/150",
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {item.name || "Unnamed Product"}
                  </Text>
                  <Text style={styles.productPrice}>${item.price || 0}</Text>
                  <View style={styles.addButtonContainer}>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item)}
                      style={styles.addButton}
                    >
                      <FontAwesomeIcon icon={faMinus} size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {cart[item.id]?.quantity || 0}
                    </Text>
                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      style={styles.addButton}
                    >
                      <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </ScrollView>
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
  carouselContainer: {
    height: 200,
    marginVertical: 10,
  },
  carouselImage: {
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
  offersSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  offerItem: {
    marginRight: 15,
    width: 150,
  },
  offerImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  offerText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: "#7f8c8d",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  distance: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  offers: {
    fontSize: 12,
    color: "#00cc69",
    marginTop: 2,
  },
  addButtonContainer: {
    flexDirection: "row", // Đặt các nút nằm ngang
    alignItems: "center",
    justifyContent: "space-between", // Đặt khoảng cách giữa các nút
  },
  addButton: {
    backgroundColor: "#00cc69",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5, // Tạo khoảng cách giữa các nút
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#000",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
