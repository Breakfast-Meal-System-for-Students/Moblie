import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faShoppingCart,
  faPlus,
  faMinus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function ProductDetailScreen({ route, navigation }) {
  const { product, cart, setCart } = route.params;
  const [notification, setNotification] = useState("");

  const addToCart = () => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      const newQuantity = currentQuantity + 1;

      setNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
      setTimeout(() => setNotification(""), 2000);

      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: newQuantity,
        },
      };
    });
  };

  const removeFromCart = () => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        return {
          ...prevCart,
          [product.id]: {
            product,
            quantity: newQuantity,
          },
        };
      } else {
        const updatedCart = { ...prevCart };
        delete updatedCart[product.id];
        return updatedCart;
      }
    });
  };

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
            {Object.keys(cart).reduce(
              (total, key) => total + cart[key].quantity,
              0
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hình ảnh sản phẩm */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Tên sản phẩm */}
      <Text style={styles.productName}>{product.name}</Text>
      {/* Mô tả sản phẩm */}
      <Text style={styles.productDescription}>
        Đây là mô tả chi tiết của sản phẩm {product.name}. Bạn có thể thêm mô tả
        tại đây.
      </Text>
      {/* Giá và nút thêm/xóa */}
      <View style={styles.addButtonPriceContainer}>
        <Text style={styles.productPrice}>${product.price}</Text>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity onPress={removeFromCart} style={styles.addButton}>
            <FontAwesomeIcon icon={faMinus} size={16} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>
            {cart[product.id]?.quantity || 0}
          </Text>

          <TouchableOpacity onPress={addToCart} style={styles.addButton}>
            <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Thông báo thêm sản phẩm vào giỏ hàng */}
      {notification !== "" && (
        <Text style={styles.notificationText}>{notification}</Text>
      )}

      <Text style={styles.commentsTitle}>Bình luận</Text>
    </View>
  );

  const comments = [
    { id: 1, user: "John Doe", comment: "Great product! Highly recommend it." },
    { id: 2, user: "Jane Smith", comment: "Not what I expected, but okay." },
    { id: 3, user: "Alex Johnson", comment: "Good value for the price!" },
  ];

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View style={styles.commentItem}>
          <View style={styles.commentHeader}>
            <FontAwesomeIcon icon={faUser} size={18} color="#00cc69" />
            <Text style={styles.commentUser}>{item.user}</Text>
          </View>
          <View style={styles.commentBody}>
            <FontAwesomeIcon icon={faCommentDots} size={16} color="#666" />
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        </View>
      )}
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
  bannerContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "left",
    paddingHorizontal: 20,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    textAlign: "left",
    paddingHorizontal: 20,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
    paddingHorizontal: 20,
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
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    paddingHorizontal: 20,
  },
  commentItem: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentUser: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  commentBody: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  commentText: {
    marginLeft: 5,
    color: "#666",
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
