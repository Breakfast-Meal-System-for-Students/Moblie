import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
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
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
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
          const cartData = response.data.data;
          if (cartData && Array.isArray(cartData.cartDetails)) {
            const cartItems = cartData.cartDetails;
            setCartId(cartData.id);
            setListData(cartItems.length === 0 ? [] : cartItems);
            calculateTotal(cartItems);
          } else {
            setListData([]);

          }
        } else {
          Alert.alert("Error", "Failed to fetch cart data.");
        }
      } catch (error) {
        console.error("Fetch cart data error:", error);
        Alert.alert("Error", "An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const calculateTotal = (updatedItems) => {
    const total = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total - discount);
  };

  const applyVoucher = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Voucher/ApplyVoucher",
        {
          voucherCode: voucherCode,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        const discountAmount = response.data.data.discountAmount;
        setDiscount(discountAmount);
        calculateTotal(listData);
        Alert.alert("Success", `Voucher applied! Discount: $${discountAmount}`);
      } else {
        Alert.alert("Error", "Invalid voucher code.");
      }
    } catch (error) {
      console.error("Voucher error:", error);
      Alert.alert("Error", "An error occurred while applying the voucher.");
    }
  };

  const fetchCoupons = async () => {
    try {
      const shopId = await AsyncStorage.getItem("shopId");
      const response = await axios.get(
        `https://bms-fs-api.azurewebsites.net/api/Coupon/get-all-coupon-for-shop?shopId=${shopId}`,
        { headers: { accept: "*/*" } }
      );

      if (response.data.isSuccess) {
        setCoupons(response.data.data.data);
      } else {
        console.error("Failed to fetch coupons:", response.data.messages);
      }
    } catch (error) {
      console.error("Fetch coupons error:", error);
    }
  };

  useEffect(() => {

    fetchCoupons(); // Fetch coupons when the component mounts
  }, []);

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
          headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
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

  const createOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const orderDate = new Date().toISOString();
      const orderData = {
        cartId: cartId,
        orderDate: orderDate,
        voucherId: selectedCoupon?.id,
      };


      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Order/CreateOrder",
        orderData,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setPaymentSuccessModalVisible(true);

      } else {
        setPaymentFailModalVisible(true);
        Alert.alert("Error", "Failed to create order.");
      }
    } catch (error) {
      console.error("Create order error:", error);
      if (error.response?.data?.detail) {
        Alert.alert("Info", error.response.data.detail);
      } else {
        Alert.alert("Error", "An error occurred while creating the order.");
      }

      setPaymentFailModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00cc69" />
          <Text>Loading...</Text>
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>

        </View>
      ) : // Coupons List
      Array.isArray(coupons) && coupons.length > 0 ? (
        coupons.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.couponItem,
              selectedCoupon &&
                selectedCoupon.id === item.id &&
                styles.selectedCoupon,
            ]}
            onPress={() => setSelectedCoupon(item)}
          >
            <Text style={styles.couponName}>{item.name}</Text>
            <Text style={styles.couponDetails}>
              Discount: {item.percentDiscount}% (Max: ${item.maxDiscount})
            </Text>
          </TouchableOpacity>
        ))
      ) : (

        <SwipeListView
          data={listData}
          renderItem={({ item, index }) => (
            <View style={styles.rowFront}>
              <Image
                source={{
                  uri: item.images[0]?.url || "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.textStyle}>{item.name}</Text>
                <Text style={styles.textStyle}>{item.note}</Text>
                <Text style={styles.priceStyle}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(index)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(index)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
              >
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={0}
          rightOpenValue={-75}
          disableRightSwipe
          keyExtractor={(item) => item.id.toString()}
        />
      )}


      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.applyButton} onPress={applyVoucher}>
          <Text style={styles.applyButtonText}>Apply Voucher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderButton} onPress={createOrder}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>


      <Modal
        visible={isPaymentSuccessModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Payment Successful!</Text>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => navigation.navigate("Payment")}
            >
              <Text style={styles.paymentButtonText}>Go to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPaymentFailModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Payment Failed!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPaymentFailModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00cc69",
  },
  backButton: { marginRight: 16 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "bold", color: "#fff" },
  cartButton: { flexDirection: "row", alignItems: "center" },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    padding: 2,
  },
  cartBadgeText: { color: "#fff", fontSize: 12 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: { fontSize: 18, color: "#888" },
  rowFront: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
  },
  productImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  productDetails: { flex: 1 },
  textStyle: { fontSize: 16, fontWeight: "600" },
  priceStyle: { fontSize: 14, color: "#888" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  quantityButtonText: { fontSize: 18, fontWeight: "bold" },
  quantityText: { fontSize: 16, paddingHorizontal: 10 },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#ff3b30",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: "100%",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  voucherInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#00cc69",

    padding: 10,
    borderRadius: 5,

    alignItems: "center",
    marginBottom: 10,
  },
  applyButtonText: { color: "#fff", fontWeight: "bold" },
  orderButton: {

    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 5,

    alignItems: "center",
  },
  orderButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  paymentButton: {
    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  paymentButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#00cc69",
    padding: 10,
    borderRadius: 5,
  },

  modalButtonText: { color: "#fff", fontWeight: "bold" },

});

export default CartScreen;
