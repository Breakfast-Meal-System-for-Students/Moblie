import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TextInput,

} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faShoppingCart,
  faPlus,
  faMinus,
  faStickyNote, // Import the note icon
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
  const { cart = {}, setCart = () => {} } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const { productId } = route.params || {};
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [shopId1, setShop1] = useState(null);

  const [note, setNote] = useState(""); // State for the note input

  const addToCart = async () => {
    const requestBody = {
      cartId: null,
      productId: product.id,
      quantity: quantity,
      price: product.price,
      note: note, // Use the note from the input
    };

    try {
    //  const storedShopId = await AsyncStorage.getItem("shopId");
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/AddCartDetail?shopId=${shopId1}`,
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.messages[0]?.content || "Failed to add to cart"
        );
      }

      const data = await response.json();
      Alert.alert("Success", data.messages[0].content);
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

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  const renderHeader = () => (
    <View>
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
          <Text style={styles.cartItemCount}>
            {cart && Object.keys(cart).length > 0
              ? Object.keys(cart).reduce(
                  (total, key) => total + (cart[key]?.quantity || 0),
                  0
                )
              : 0}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Large Image */}
        <Image
          source={{
            uri:
              product?.images?.[selectedImageIndex]?.url ||
              "https://yhg.vn/wp-content/uploads/2021/02/pizza-y.jpg",
          }}
          style={styles.productImageLarge}
        />

        {/* Thumbnails */}
        <FlatList
          data={product?.images || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
              <Image
                source={{ uri: item.url || "https://via.placeholder.com/150" }}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.activeThumbnail,
                ]}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.thumbnailContainer}
        />

        <Text style={styles.productName}>
          {product?.name || "Default Product Name"}
        </Text>
        <Text style={styles.productDescription}>
          {product?.description || "No description available."}
        </Text>

        {/* Note Input */}
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          value={note}
          onChangeText={setNote}
        />

      </View>

      <View style={styles.addButtonPriceContainer}>
        <Text style={styles.productPrice}>${product?.price || "0.00"}</Text>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.addButton}
          >
            <FontAwesomeIcon icon={faMinus} size={16} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.addButton}
          >
            <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Input Section */}
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

      <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      {notification !== "" && (
        <Text style={styles.notificationText}>{notification}</Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={[]} // Empty data since comments are removed
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={null} // No renderItem since comments are removed
    />
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
  },
  productImageLarge: {
    width: width * 1,
    height: 370,
    borderRadius: 10,
    marginBottom: 15,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
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
    marginVertical: 10,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    textAlign: "center",
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
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#00cc69",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#000",
  },
  notificationText: {
    color: "#00cc69",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 1,
  },
  addButtonPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addToCartButton: {
    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 2,
    marginHorizontal: 2,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
    padding: 5,
    backgroundColor: "#f9f9f9", // Light background for contrast
    borderRadius: 10, // Rounded corners for the container
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Adds shadow for Android
    marginHorizontal: 2,
  },

  noteInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10, // Increased vertical padding for comfort
    paddingHorizontal: 15, // Horizontal padding for spacing
    borderRadius: 10, // Rounded corners for input field
    borderColor: "#ccc", // Light border color
    borderWidth: 1, // Border width
    backgroundColor: "#fff", // White background for input
  },

  noteInputFocused: {
    borderColor: "#00cc69", // Change border color when focused

  },
});
