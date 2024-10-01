import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const [listData, setListData] = useState([]);
  const [isPaymentSuccessModalVisible, setPaymentSuccessModalVisible] =
    useState(false);
  const [isPaymentFailModalVisible, setPaymentFailModalVisible] =
    useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        "https://bms-fs-api.azurewebsites.net/api/Cart/GetAllCartForUser",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageIndex: 1, pageSize: 10 },
        }
      );
      if (response.data.isSuccess) {
        const cartItems = response.data.data;
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

  const deleteRow = (rowKey) => {
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
    calculateTotal(newData);
  };

  const calculateTotal = (updatedItems) => {
    if (!Array.isArray(updatedItems)) {
      updatedItems = [];
    }
    const total = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handlePlaceOrder = () => {
    const paymentSuccess = Math.random() > 0.5; // 50% success rate for demo
    if (paymentSuccess) {
      setPaymentSuccessModalVisible(true);
    } else {
      setPaymentFailModalVisible(true);
    }
  };

  const increaseQuantity = (key) => {
    const updatedData = listData.map((item) =>
      item.key === key ? { ...item, quantity: item.quantity + 1 } : item
    );
    setListData(updatedData);
    calculateTotal(updatedData);
  };

  const decreaseQuantity = (key) => {
    const updatedData = listData.map((item) =>
      item.key === key && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setListData(updatedData);
    calculateTotal(updatedData);
  };

  const renderItem = (data) => (
    <View style={styles.rowFront}>
      <Image source={{ uri: data.item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.textStyle}>{data.item.text}</Text>
        <Text style={styles.noteStyle}>{data.item.note}</Text>
        <Text style={styles.priceStyle}>${data.item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(data.item.key)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{data.item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(data.item.key)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(data.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Summary</Text>

      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Success Modal */}
      <Modal visible={isPaymentSuccessModalVisible} animationType="slide">
        <View style={styles.successModalContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={100}
            color="#4CAF50"
          />
          <Text style={styles.successTitle}>Order successful!</Text>
          <Text style={styles.successMessage}>
            Your order will be delivered on time. Thank you!
          </Text>

          <TouchableOpacity
            style={styles.viewOrdersButton}
            onPress={() => setPaymentSuccessModalVisible(false)}
          >
            <Text style={styles.viewOrdersText}>View orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => setPaymentSuccessModalVisible(false)}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Payment Failure Modal */}
      <Modal visible={isPaymentFailModalVisible} animationType="slide">
        <View style={styles.failModalContainer}>
          <Ionicons name="close-circle-outline" size={100} color="#DD2C00" />
          <Text style={styles.failTitle}>Payment Failed!</Text>
          <Text style={styles.failMessage}>
            There was an issue with your payment. Please try again.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setPaymentFailModalVisible(false)}
          >
            <Text style={styles.retryButtonText}>Retry Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setPaymentFailModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 20,
    color: "#003366",
    marginVertical: 10,
  },
  rowFront: {
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noteStyle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  priceStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DD2C00",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
  backTextWhite: {
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  orderButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
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
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 20,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  viewOrdersButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginTop: 20,
  },
  viewOrdersText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  continueShoppingButton: {
    backgroundColor: "#E0F7EF",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 15,
  },
  continueShoppingText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 16,
  },
  failModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE8E8",
  },
  failTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DD2C00",
    marginTop: 20,
  },
  failMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#b71c1c",
  },
  retryButton: {
    backgroundColor: "#DD2C00",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FFE8E8",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#DD2C00",
  },
  cancelButtonText: {
    color: "#DD2C00",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CartScreen;
