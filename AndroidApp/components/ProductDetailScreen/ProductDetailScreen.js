import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faShoppingCart,
  faPlusCircle,
  faMinusCircle,
  faStickyNote,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const NoteInput = ({ note, setNote }) => {
  return (
    <View style={styles.noteContainer}>
      <FontAwesomeIcon icon={faStickyNote} size={24} color="#00cc69" />
      <TextInput
        style={styles.noteInput}
        placeholder="Add a note for your order (optional)"
        value={note}
        onChangeText={setNote}
        placeholderTextColor="#999"
        multiline
        numberOfLines={2}
      />
    </View>
  );
};

export default function ProductDetailScreen({ route, navigation }) {
  const { cart = {}, setCart = () => {} } = route.params || {};
  const [loading, setLoading] = useState(true);
  const { productId, shopId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [shopId1, setShop1] = useState(null);
  const [note, setNote] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchCountCartItem();
    }, [])
  );

  const fetchCountCartItem = async () => {
    if (!shopId) return;
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/CountCartItemInShop?shopId=${shopId}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.isSuccess) {
        setCartCount(result.data);
      } else {
        Alert.alert("Error", "Unable to fetch cart information");
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const addToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const cartGroupId = await AsyncStorage.getItem("cartGroupId");

      const requestBody = {
        cartId: cartGroupId ?? null,
        productId: productId,
        quantity: quantity,
        price: product?.price || 0,
        note: note.trim(),
        shopId: shopId1,
      };

      const endpoint = cartGroupId
        ? "https://bms-fs-api.azurewebsites.net/api/Cart/AddCartDetailForGroup"
        : `https://bms-fs-api.azurewebsites.net/api/Cart/AddCartDetail?shopId=${requestBody.shopId}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.messages[0]?.content || "Failed to add to cart"
        );
      }

      Alert.alert("Success", "Item added to cart successfully!", [
        {
          text: "Continue Shopping",
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () => navigation.navigate("Cart"),
        },
      ]);

      fetchCountCartItem();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Product/${productId}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setProduct(data.data);
          setShop1(data.data.shopId);
        } else {
          Alert.alert("Error", "Unable to fetch product details");
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00cc69" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {product?.shopName || "Fast Food"}
        </Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product?.images?.[selectedImageIndex]?.url ||
                "https://via.placeholder.com/400",
            }}
            style={styles.mainImage}
          />
        </View>

        {/* Image Thumbnails */}
        <View style={styles.thumbnailContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScrollContent}
          >
            {product?.images?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  selectedImageIndex === index && styles.selectedThumbnail,
                ]}
              >
                <Image source={{ uri: item.url }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product?.name}</Text>
          <Text style={styles.price}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product?.price || 0)}
          </Text>

          {product?.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          {!product?.isOutOfStock ? (
            <>
              {/* Quantity Selector */}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity <= 1 && styles.quantityButtonDisabled,
                    ]}
                    onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    <FontAwesomeIcon
                      icon={faMinusCircle}
                      size={24}
                      color={quantity <= 1 ? "#ccc" : "#00cc69"}
                    />
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity((prev) => prev + 1)}
                  >
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      size={24}
                      color="#00cc69"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Note Input */}
              <NoteInput note={note} setNote={setNote} />

              {/* Add to Cart Button */}
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={addToCart}
              >
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  size={24}
                  color="#fff"
                  style={styles.addToCartIcon}
                />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.outOfStockContainer}>
              <Text style={styles.outOfStockText}>Currently Unavailable</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00cc69",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#00cc69",
    marginTop: 15,
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbnailContainer: {
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  thumbnailScrollContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  selectedThumbnail: {
    borderColor: "#00cc69",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ff3b30",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },
  noteContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noteInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1a1a1a",
    padding: 0,
    minHeight: 40,
  },
  addToCartButton: {
    backgroundColor: "#00cc69",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  outOfStockContainer: {
    backgroundColor: "#fff3f3",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  outOfStockText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff3b30",
    textTransform: "uppercase",
  },
});
