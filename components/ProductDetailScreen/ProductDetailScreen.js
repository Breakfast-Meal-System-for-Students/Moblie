import React, { useState, useEffect, useRef, memo } from "react";
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
  Alert,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faShoppingBag,
  faPlusCircle,
  faMinusCircle,
  faStickyNote,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Separate NoteInput component
const NoteInput = memo(({ note, setNote }) => {
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
});

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
          <FontAwesomeIcon icon={faShoppingBag} size={24} color="#fff" />
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

<<<<<<< Updated upstream
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
=======
          <Text style={styles.productName}>
            {product?.name || "Default Product Name"}
          </Text>
          <Text style={styles.productDescription}>
            {product?.description || "No description available."}
          </Text>
        </View>

        <View style={styles.addButtonPriceContainer}>
          <Text style={styles.productPrice}>{product?.price || "0.00"}₫</Text>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.addButton}
            >
              <FontAwesomeIcon icon={faMinusCircle} size={20} color="#00cc69" />
>>>>>>> Stashed changes
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.thumbnailContainer}
        />

<<<<<<< Updated upstream
        <Text style={styles.productName}>
          {product?.name || "Default Product Name"}
        </Text>
        <Text style={styles.productDescription}>
          {product?.description || "No description available."}
        </Text>
      </View>

      <View style={styles.addButtonPriceContainer}>
        <Text style={styles.productPrice}>${product?.price || "0.00"}</Text>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.addButton}
          >
            <FontAwesomeIcon icon={faMinusCircle} size={20} color="#00cc69" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.addButton}
          >
            <FontAwesomeIcon icon={faPlusCircle} size={20} color="#00cc69" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Note input */}
      <NoteInput note={note} setNote={setNote} />
=======
        <NoteInput note={note} setNote={handleSetNote} />
      </ScrollView>

>>>>>>> Stashed changes
      <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
        <FontAwesomeIcon
          icon={faClipboardCheck}
          size={29}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[]} // Empty data
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={null} // No renderItem needed
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
    backgroundColor: "#00cc69", // Giữ màu xanh lá cho thanh header
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
    backgroundColor: "#fff", // Nền trắng cho toàn bộ giao diện
  },
  productImageLarge: {
    width: width, // Chiếm toàn bộ chiều rộng của màn hình
    height: 320, // Điều chỉnh chiều cao để cân đối
    borderRadius: 10, // Bo góc nhẹ hơn để không quá vuông
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    backgroundColor: "#fff", // Nền trắng cho hình ảnh sản phẩm lớn
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
    backgroundColor: "#fff", // Màu trắng cho các nút
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
  notificationText: {
    color: "#00cc69",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  addButtonPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -8,
    paddingHorizontal: 50,
    backgroundColor: "#fff", // Set the background color to white
    paddingVertical: 15, // Add padding to create space around elements
    borderRadius: 15, // Optional: Add some border-radius for a soft look
    shadowColor: "#000", // Optional: Add shadow for a slight 3D effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  addToCartButton: {
    backgroundColor: "#00cc69", // Nút thêm vào giỏ hàng giữ màu xanh lá
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
    marginVertical: 1,
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
});
