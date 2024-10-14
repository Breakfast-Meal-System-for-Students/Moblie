import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CartScreen = () => {
  const navigation = useNavigation();
  const [listData, setListData] = useState([]);
  const [isPaymentSuccessModalVisible, setPaymentSuccessModalVisible] =
    useState(false);
  const [isPaymentFailModalVisible, setPaymentFailModalVisible] =
    useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const shopId = await AsyncStorage.getItem("shopId");
        const response = await axios.get(
          `https://bms-fs-api.azurewebsites.net/api/Cart/GetCartInShopForUser?shopId=${shopId}`,
          {
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.isSuccess) {
          const cartItems = response.data.data.cartDetails;
          setListData(cartItems);
          calculateTotal(cartItems);
        } else {
          Alert.alert("Error", "Failed to fetch cart data.");
        }
      } catch (error) {
        console.error("Fetch cart data error:", error);
        Alert.alert("Error", "An error occurred while fetching cart data.");
      }
    };

    fetchCartData();
  }, []);

  const calculateTotal = (updatedItems) => {
    const total = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const increaseQuantity = (index) => {
    const updatedItems = [...listData];
    updatedItems[index].quantity += 1;
    setListData(updatedItems);
    calculateTotal(updatedItems);
  };

  const decreaseQuantity = (index) => {
    const updatedItems = [...listData];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setListData(updatedItems);
      calculateTotal(updatedItems);
    }
  };

  const deleteItem = async (cartItemId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.delete(
        `https://bms-fs-api.azurewebsites.net/api/Cart/DeleteCartItem`,
        {
          params: { cartItemId },
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedItems = listData.filter((item) => item.id !== cartItemId);
        setListData(updatedItems);
        calculateTotal(updatedItems);
        Alert.alert("Success", "Item has been removed from your cart.");
      } else {
        Alert.alert("Error", "Failed to delete item.");
      }
    } catch (error) {
      console.error("Delete item error:", error);
      Alert.alert("Error", "An error occurred while deleting the item.");
    }
  };

  const renderItem = (data) => (
    <View style={styles.rowFront}>
      <Image
        source={{
          uri: data.item.images[0].url || "https://via.placeholder.com/150",
        }}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.textStyle}>{data.item.name}</Text>
        <Text style={styles.priceStyle}>${data.item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(data.index)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{data.item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(data.index)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteItem(data.item.id)}
      >
        <Ionicons name="trash-outline" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );

  const placeOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        `https://bms-fs-api.azurewebsites.net/api/Order/PlaceOrder`,
        {
          items: listData,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        // Navigate to OrderStatus and pass the order details
        navigation.navigate("OrderStatus", {
          orderId: response.data.data.orderId, // Assuming the response contains orderId
          totalPrice: totalPrice,
          items: listData,
        });
      } else {
        Alert.alert("Error", "Failed to place order.");
      }
    } catch (error) {
      console.error("Place order error:", error);
      Alert.alert("Error", "An error occurred while placing the order.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order Summary</Text>

        <TouchableOpacity style={styles.cartButton}>
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Product List */}
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        style={styles.listView}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modals */}
      <Modal visible={isPaymentSuccessModalVisible} animationType="slide">
        <View style={styles.successModalContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={100}
            color="#4CAF50"
          />
          <Text style={styles.successTitle}>Order successful!</Text>
          <TouchableOpacity
            onPress={() => setPaymentSuccessModalVisible(false)}
          >
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isPaymentFailModalVisible} animationType="slide">
        <View style={styles.failModalContainer}>
          <Ionicons name="close-circle-outline" size={100} color="#DD2C00" />
          <Text style={styles.failTitle}>Payment Failed!</Text>
          <TouchableOpacity onPress={() => setPaymentFailModalVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F6F9",
    flex: 1,
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
  headerTitle: {
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
  cartBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  rowFront: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
    marginTop: 20,
  },
  productDetails: {
    flex: 1,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  priceStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00cc99",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#333",
  },
  quantityButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DD2C00",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    backgroundColor: "#DD2C00",
    right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "red",
  },
  orderButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#00cc69",
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  orderButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 20,
  },
  failModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  failTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DD2C00",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default CartScreen;
