import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

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
  const [loading, setLoading] = useState(true); // Loading state
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isMemberGroup, setIsMemberGroup] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const cartGroupId = await AsyncStorage.getItem("cartGroupId");
        const accessTokenGroupId = await AsyncStorage.getItem("accessTokenGroupId");
        const token = await AsyncStorage.getItem("userToken");
        const shopId = await AsyncStorage.getItem("shopId");
        const userId = await AsyncStorage.getItem("userId");
        var result = null;
        if (cartGroupId && accessTokenGroupId) {
          setIsMemberGroup(true);
          result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Cart/GetCartBySharing/${cartGroupId}?access_token=${accessTokenGroupId}`, {
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          result = await fetch(
            `https://bms-fs-api.azurewebsites.net/api/Cart/GetCartInShopForUser?shopId=${shopId}`,
            {
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        const resBody = await result.json();
        if (resBody.isSuccess) {
          if (resBody.data) {
            const creatorUserId = resBody.data.customerId;
            if (userId == creatorUserId) {
              setIsMemberGroup(false);
            }
          }

          const cartData = resBody.data; // Store the data in a variable

          // Check if cartData is not null and has cartDetails
          if (cartData && Array.isArray(cartData.cartDetails)) {
            const cartItems = cartData.cartDetails;

            // Set cart ID
            setCartId(cartData.id);

            // Check if the cart is empty
            if (cartItems.length === 0) {
              // Alert.alert("Info", "Your cart is empty.");
              setListData([]); // Ensure listData is set to an empty array
            } else {
              setListData(cartItems);
              calculateTotal(cartItems);
            }
          } else {
            //   Alert.alert("Info", "Your cart is empty or not found.");
            setListData([]); // Ensure listData is set to an empty array
          }
        } else {
          console.log(resBody);
          await AsyncStorage.removeItem("cartGroupId");
          await AsyncStorage.removeItem("accessTokenGroupId");
          Alert.alert("Error", "Failed to fetch cart data.");
        }
      } catch (error) {
        console.error("Fetch cart data error:", error);
        Alert.alert("Error", "An error occurred while fetching cart data.");
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchCartData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCountCartItem();
    }, [])
  );

  const fetchCountCartItem = async () => {
    const shopId = await AsyncStorage.getItem("shopId");
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Cart/CountCartItemInShop?shopId=${shopId}`, {
      method: 'GET',
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`
      },
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      setCartCount(resBody.data);
    } else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  }

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
        calculateTotal(listData); // Recalculate the total price
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
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.data.isSuccess) {
        setCoupons(response.data.data.data); // Set the coupons data
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

  const fetchApiUpdateCartItemQuantity = async (data, quantity) => {
    const shopId = await AsyncStorage.getItem("shopId");
    const cartGroupId = await AsyncStorage.getItem("cartGroupId");
    const jsonBody = {
      shopId: shopId,
      cartId: cartGroupId ?? data.cartId,
      productId: data.productId,
      quantity: quantity,
      price: data.price,
      note: data.note
    }
    console.log(jsonBody);
    const result = await fetch(`https://bms-fs-api.azurewebsites.net/api/Cart/UpdateCartDetail`, {
      method: 'POST',
      headers: {
        'Accept': '*/*', // Thêm header Accept
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody)
    });
    const resBody = await result.json();
    console.log(resBody);
    if (!resBody.isSuccess) {
      console.log(resBody);
      Alert.alert("Update cart quantity failed!");
    }
  }

  const increaseQuantity = async (data, index) => {
    const updatedItems = [...listData];
    updatedItems[index].quantity += 1;
    setListData(updatedItems);
    calculateTotal(updatedItems);
    await fetchApiUpdateCartItemQuantity(data, updatedItems[index].quantity);
  }

  const decreaseQuantity = async (data, index) => {
    const updatedItems = [...listData];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setListData(updatedItems);
      calculateTotal(updatedItems);
    }
    await fetchApiUpdateCartItemQuantity(data, updatedItems[index].quantity);
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
        <Text style={styles.textStyle}>{data.item.note}</Text>
        <Text style={styles.priceStyle}>${data.item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(data, data.index)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{data.item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(data, data.index)}
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

  // const placeOrder = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("userToken");
  //     const response = await axios.post(
  //       `https://bms-fs-api.azurewebsites.net/api/Order/PlaceOrder`,
  //       {
  //         items: listData,
  //         totalPrice: totalPrice,
  //       },
  //       {
  //         headers: {
  //           Accept: "*/*",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.isSuccess) {
  //       // Navigate to OrderStatus and pass the order details
  //       navigation.navigate("OrderStatus", {
  //         orderId: response.data.data.orderId, // Assuming the response contains orderId
  //         totalPrice: totalPrice,
  //         items: listData,
  //       });
  //     } else {
  //       Alert.alert("Error", "Failed to place order.");
  //     }
  //   } catch (error) {
  //     console.error("Place order error:", error);
  //     Alert.alert("Error", "An error occurred while placing the order.");
  //   }
  // };

  const handleCreateOrder = () => {
    createOrder();
  };

  const navigateToPayment = async (orderId) => {
    const shopId = await AsyncStorage.getItem("shopId");
    navigation.navigate("Payment", {
      fullName: "User Name", // Replace this with the actual user’s name if available
      // orderInfo: `Order-${cartId}`, // Example order info using cart ID
      orderInfo: `${orderId}`, // Example order info using cart ID
      orderType: "general", // Set your order type
      description: "Order description", // Set a description if needed
      amount: totalPrice, // Send total price
      shopId, // Pass the cart ID for reference
      selectedCoupon: selectedCoupon, // Pass selected coupon if available
    });
  }

  const createOrder = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const orderDate = new Date().toISOString();
    const orderData = {
      cartId: cartId,
      orderDate: orderDate,
    };
    const response = await fetch("https://bms-fs-api.azurewebsites.net/api/Order/CreateOrder", {
      method: 'POST',
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }
    );
    const resBody = await response.json();
    if (resBody.isSuccess) {
      navigateToPayment(resBody.data);
    } else {
      console.log(resBody);
      Alert.alert("Failed when create order!!!");
    }
  };

  // Render loading spinner or cart items
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.cartIconContainer}>
          <FontAwesomeIcon icon={faShoppingCart} size={20} color="#FFFFFF" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Loading State */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00cc69" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <SwipeListView
            data={listData}
            renderItem={({ item, index }) => (
              <View style={styles.cartItem}>
                <Image
                  source={{
                    uri:
                      item.images && item.images[0] && item.images[0].url
                        ? item.images[0].url
                        : "https://via.placeholder.com/150",
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productNote}>{item.note}</Text>
                  <Text style={styles.productPrice}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.price || 0)}
                  </Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(item, index)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(item, index)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenItem}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(data.item.id)}
                >
                  <Ionicons name="trash" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-75}
            style={styles.list}
          />

          {/* Coupons Section */}
          <View style={styles.couponsSection}>
            <Text style={styles.sectionTitle}>Available Coupons</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={coupons}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.couponCard,
                    selectedCoupon?.id === item.id && styles.selectedCouponCard,
                  ]}
                  onPress={() => setSelectedCoupon(item)}
                >
                  <Text style={styles.couponDiscount}>
                    {item.percentDiscount}% OFF
                  </Text>
                  <Text style={styles.couponName}>{item.name}</Text>
                  <Text style={styles.couponLimit}>
                    Up to {""}
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.maxDiscount || 0)}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.couponsList}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalPrice || 0)}
              </Text>
            </View>
            {selectedCoupon && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.discountValue}>
                  -$
                  {(
                    (totalPrice * selectedCoupon.percentDiscount) /
                    100
                  ).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format((
                  totalPrice -
                  (selectedCoupon
                    ? (totalPrice * selectedCoupon.percentDiscount) / 100
                    : 0)
                ).toFixed(2) || 0)}
              </Text>
            </View>
            {!isMemberGroup && (
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCreateOrder}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* Success Modal */}
      <Modal
        visible={isPaymentSuccessModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={styles.modalTitle}>Order Successful!</Text>
            <Text style={styles.modalText}>
              Thank you for your purchase. Your order has been confirmed.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setPaymentSuccessModalVisible(false);
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.modalButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Failure Modal */}
      <Modal
        visible={isPaymentFailModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="close-circle" size={80} color="#F44336" />
            <Text style={[styles.modalTitle, styles.errorTitle]}>
              Payment Failed
            </Text>
            <Text style={styles.modalText}>
              Something went wrong with your payment. Please try again.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.errorButton]}
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
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00cc69",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cartIconContainer: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productNote: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF0000",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  hiddenItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
    borderRadius: 12,
  },
  couponsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  couponsList: {
    paddingVertical: 8,
  },
  couponCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCouponCard: {
    backgroundColor: "#E3F2FD",
    borderColor: "#00cc69",
    borderWidth: 2,
  },
  couponDiscount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00cc69",
    marginBottom: 4,
  },
  couponName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  couponLimit: {
    fontSize: 12,
    color: "#999",
  },
  summary: {
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E1E8EE",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  discountValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E1E8EE",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF0000",
  },
  checkoutButton: {
    backgroundColor: "#00cc69",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginVertical: 8,
  },
  errorTitle: {
    color: "#F44336",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },
  modalButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorButton: {
    backgroundColor: "#F44336",
  },
});

export default CartScreen;
