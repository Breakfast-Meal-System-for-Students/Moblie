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
  Platform,
  item,
  price,
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

const { width } = Dimensions.get("window");

const NoteInput = ({ note, setNote }) => {
  return (
    <View style={styles.noteContainer}>
      <FontAwesomeIcon icon={faStickyNote} size={29} color="#00cc69" />
      <TextInput
        style={styles.noteInput}
        placeholder="Thêm ghi chú (tuỳ chọn)"
        value={note}
        onChangeText={setNote}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
};

export default function ProductDetailScreen({ route, navigation }) {
  const { cart = {}, setCart = () => {} } = route.params || {};
  const [loading, setLoading] = useState(true);
  const { productId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [shopId1, setShop1] = useState(null);
  const [note, setNote] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const totalItems = Object.values(cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartItemCount(totalItems);
  }, [cart]);

  const addToCart = async (event) => {
    event.persist();
    const cartGroupId = await AsyncStorage.getItem("cartGroupId");
    const requestBody = {
      cartId: cartGroupId ?? null,
      productId: productId,
      quantity: quantity,
      price: product?.price || 0,
      note: note,
      shopId: shopId1,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      var response = null;
      if (cartGroupId) {
        response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Cart/AddCartDetailForGroup`,
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
      } else {
        response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Cart/AddCartDetail?shopId=${requestBody.shopId}`,
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.messages[0]?.content || "Failed to add to cart"
        );
      }

      // const data = await response.json();
      Alert.alert("Success", "Item has been added to cart successfully!");
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
          console.error("Error fetching product details:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSetNote = useCallback((text) => {
    setNote(text);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  return (
    <View style={{ flex: 1 }}>
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
          onPress={() => navigation.navigate("Checkout", { cart })}
        >
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
          <Text style={styles.cartItemCount}>{cartItemCount}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <Image
            source={{
              uri:
                product?.images?.[selectedImageIndex]?.url ||
                "https://yhg.vn/wp-content/uploads/2021/02/pizza-y.jpg",
            }}
            style={styles.productImageLarge}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {product?.images?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image
                  source={{
                    uri: item.url || "https://via.placeholder.com/150",
                  }}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.activeThumbnail,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.productName}>
            {product?.name || "Default Product Name"}
          </Text>
          <Text style={styles.productDescription}>
            {product?.description || "No description available."}
          </Text>
        </View>

        {!product?.isOutOfStock && (
          <View style={styles.addButtonPriceContainer}>
            <Text style={styles.productPrice}>
              {formatPrice(product?.price || 0)}
            </Text>
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.addButton}
              >
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  size={20}
                  color="#00cc69"
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.addButton}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size={20}
                  color="#00cc69"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!product?.isOutOfStock && (
          <NoteInput note={note} setNote={handleSetNote} />
        )}
        {!product?.isOutOfStock && (
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <FontAwesomeIcon
              icon={faClipboardCheck}
              size={29}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
        {product?.isOutOfStock && (
          <Text style={styles.stopSellingText}>Stop Selling</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#00cc69",
    marginTop: Platform.OS === "ios" ? 59 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  shopName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cartButton: {
    padding: 10,
    position: "relative",
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
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  productImageLarge: {
    width: width,
    height: 320,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeThumbnail: {
    borderColor: "#00cc69",
    borderWidth: 2,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 19,
    textAlign: "center",
    color: "#333",
  },
  productPrice: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
    marginBottom: 29,
    textAlign: "auto",
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 9,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#000",
  },
  addButtonPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -8,
    paddingHorizontal: 50,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartButton: {
    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 2,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  noteInputFocused: {
    borderColor: "#00cc69",
  },
  stopSellingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff0000",
    textAlign: "center",
    padding: 10,
    backgroundColor: "#f8d7da",
    borderRadius: 5,
    marginVertical: 10,
  },
});
