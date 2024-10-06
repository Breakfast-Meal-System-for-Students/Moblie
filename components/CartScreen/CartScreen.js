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
    if (!Array.isArray(updatedItems)) {
      updatedItems = [];
    }
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

  const deleteItem = (rowKey) => {
    const updatedItems = listData.filter((item) => item.key !== rowKey);
    setListData(updatedItems);
    calculateTotal(updatedItems);
  };

  const renderItem = (data, rowMap) => (
    <View style={styles.rowFront}>
      <Image
        source={{
          uri:
            data.item.img ||
            "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
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

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteItem(data.item.key)}
      >
        <Ionicons name="trash-outline" size={25} color="white" />
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
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isPaymentSuccessModalVisible} animationType="slide">
        <View style={styles.successModalContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={100}
            color="#4CAF50"
          />
          <Text style={styles.successTitle}>Order successful!</Text>
        </View>
      </Modal>

      <Modal visible={isPaymentFailModalVisible} animationType="slide">
        <View style={styles.failModalContainer}>
          <Ionicons name="close-circle-outline" size={100} color="#DD2C00" />
          <Text style={styles.failTitle}>Payment Failed!</Text>
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
  priceStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
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
    backgroundColor: "#DD2C00",
    right: 0,
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
});

export default CartScreen;
