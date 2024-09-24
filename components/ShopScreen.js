import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShoppingCart,
  faArrowLeft,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const carouselImages = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
  },
];

const offers = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
    discount: "30% Discount",
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
    discount: "21% Discount",
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
    discount: "50% Discount",
  },
];

const products = [
  {
    id: 1,
    name: "Big Garden Salad",
    price: 2.0,
    rating: 4.8,
    reviews: "1.2k reviews",
    distance: "2.4 Km",
    offers: "Offers are available",
    image:
      "https://i.pinimg.com/236x/41/b6/99/41b6994f16222eb7c140a6d3f67729ba.jpg",
  },
  {
    id: 2,
    name: "Jumbo Burger",
    price: 19,
    rating: 4.5,
    reviews: "800 reviews",
    distance: "3.1 Km",
    offers: "20% Discount",
    image:
      "https://i.pinimg.com/236x/f5/20/10/f52010f1acafbe3969cc567c41d44865.jpg",
  },
  {
    id: 3,
    name: "Chicken Kabab",
    price: 25,
    rating: 4.7,
    reviews: "900 reviews",
    distance: "1.8 Km",
    offers: "Buy 1 Get 1 Free",
    image:
      "https://i.pinimg.com/236x/22/84/6e/22846ecb774c5c4c1c1d5c8e767d3d8a.jpg",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [cart, setCart] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

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
    const intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselImages.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const goToProductDetail = (product) => {
    navigation.navigate("ProductDetail", { product, cart, setCart });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.shopName}>Fast Food</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Checkout", { cart })} // Điều hướng tới CheckoutScreen với dữ liệu giỏ hàng
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
          data={carouselImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.carouselImage} />
          )}
          ref={flatListRef}
          pagingEnabled
        />
      </View>

      <View style={styles.productDescriptionContainer}>
        <Text style={styles.productName}>Big Garden Salad</Text>

        <View style={styles.productDetailsRow}>
          <FontAwesome name="star" size={18} color="#f1c40f" />
          <Text style={styles.productDetailsText}>4.8 (1.2k reviews)</Text>
        </View>

        <View style={styles.productDetailsRow}>
          <FontAwesome name="map-marker" size={18} color="#00cc69" />
          <Text style={styles.productDetailsText}>2.4 Km</Text>
          <Text style={styles.productDetailsText}> | Deliver Now | $ 2.00</Text>
        </View>

        <View style={styles.productDetailsRow}>
          <FontAwesome name="tag" size={18} color="#00cc69" />
          <Text style={styles.productDetailsText}>Offers are available</Text>
        </View>
      </View>

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
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Fast food</Text>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productItem}
            onPress={() => goToProductDetail(item)} // Điều hướng ở đây
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={18} color="#f1c40f" />
                <Text style={styles.rating}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
              <Text style={styles.productPrice}>${item.price}</Text>
              <Text style={styles.distance}>{item.distance}</Text>
              <Text style={styles.offers}>{item.offers}</Text>
            </View>

            {/* Nút thêm và trừ sản phẩm */}
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
          </TouchableOpacity>
        ))}
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
});
