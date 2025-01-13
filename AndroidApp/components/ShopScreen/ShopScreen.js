import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  totalStars,
  filledStars,
  roundedStars,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShoppingCart,
  faArrowLeft,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { faUsers } from "@fortawesome/free-solid-svg-icons"; // Icon nhóm người
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";
const { width } = Dimensions.get("window");
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Import biểu tượng 'X'
import { useFocusEffect } from "@react-navigation/native";
import { io } from "socket.io-client";
import { Ionicons } from "@expo/vector-icons"; // Import icons for better visuals

// Utility function to format price
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
};

// Function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        size={20}
        color={i <= rating ? "#ffcc00" : "#ccc"} // Gold for filled stars, gray for empty stars
      />
    );
  }
  return <View style={styles.ratingContainer}>{stars}</View>;
};

export default function ShopScreen() {
  const socket = io("https://bms-socket.onrender.com");
  const navigation = useNavigation();
  const route = useRoute();
  const { id, cardId, accessToken, orderIdSuccess } = route.params || {};
  const [cartId, setCartId] = useState(cardId);
  const [cart, setCart] = useState({});
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]); // seperate to product and product combo by field isCombo
  const [listCombo, setListCombo] = useState([]);
  const [isCreatorCartGroup, setIsCreatorCartGroup] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const goToProductDetail = (item) => {
    navigation.navigate("ProductDetail", { productId: item.id, shopId: id });
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: currentQuantity + 1,
        },
      };
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;
      if (currentQuantity > 0) {
        return {
          ...prevCart,
          [product.id]: {
            product,
            quantity: currentQuantity - 1,
          },
        };
      }
      return prevCart;
    });
  };

  const checkIsCreatorOfGroup = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("userToken");
    var result = null;
    if (cardId && accessToken) {
      result = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/GetCartBySharing/${cardId}?access_token=${accessToken}`
      );
    } else {
      result = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/GetCartInShopForUser?shopId=${encodeURIComponent(
          id
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
    const resBody = await result.json();
    if (resBody.isSuccess) {
      if (resBody.data) {
        const creatorUserId = resBody.data.customerId;
        if (resBody.data.isGroup) {
          if (userId == creatorUserId) {
            setCartId(resBody.data.id);
            setIsCreatorCartGroup(true);
          } else if (cardId && accessToken) {
            await AsyncStorage.setItem("cartGroupId", cardId);
            await AsyncStorage.setItem("accessTokenGroupId", accessToken);
          }
        }
      }
    } else {
      Alert.alert("This Order has been cancel!");
      navigation.navigate("Home");
    }
  };

  const fetchCountCartItem = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/Cart/CountCartItemInShop?shopId=${id}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resBody = await result.json();
    if (resBody.isSuccess) {
      setCartCount(resBody.data);
    } else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOrderById = async () => {
        if (orderIdSuccess) {
          const token = await AsyncStorage.getItem("userToken");
          const result = await fetch(
            `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderById/${orderIdSuccess}`,
            {
              method: "GET",
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const resBody = await result.json();
          if (resBody.isSuccess) {
            const order = resBody.data;
            await fetchChangeStatusOrder(order, token);
          } else {
            Alert.alert("Error", "Can not to get order detail!!!");
          }
        }
      };
      const fetchChangeStatusOrder = async (order, token) => {
        const jsonBody = {
          vnp_Amount: order.totalPrice + "",
          vnp_OrderInfo: order.id + "",
          vnp_ResponseCode: "00",
        };
        const url = `https://bms-fs-api.azurewebsites.net/api/Payment/payment-callback`;
        const result = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: JSON.stringify(jsonBody),
        });
        const resBody = await result.json();
        if (resBody.isSuccess) {
          Alert.alert("Success", "Payment is completelly");
          setCart("");
          setCartId("");
          setIsCreatorCartGroup(false);
          await AsyncStorage.removeItem("cartGroupId");
          await AsyncStorage.removeItem("accessTokenGroupId");
          sendNotiToShop(order.id);
        } else {
          Alert.alert("An error occurs in payment");
        }
        handleBack();
      };

      fetchOrderById();
    }, [orderIdSuccess])
  );

  useFocusEffect(
    useCallback(() => {
      fetchCountCartItem();
    }, [])
  );

  const sendNotiToShop = async (orderId) => {
    const userId = await AsyncStorage.getItem("userId");
    const shopId = await AsyncStorage.getItem("shopId");
    const orderData = {
      userId,
      shopId,
      orderId,
    };
    socket.emit("new-order", orderData);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.navigate("Login", { shopId: id, cardId, accessToken });
      } else {
        checkIsCreatorOfGroup();
        fetchShopDetails();
        fetchProducts();
      }
    };

    const fetchShopDetails = async () => {
      try {
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/ShopApplication/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setShopDetails(data.data);
          await AsyncStorage.setItem("shopId", id);
        } else {
          console.error("Error fetching shop details:", data.messages);
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://bms-fs-api.azurewebsites.net/api/Product/all-product-by-shop-id?id=${id}&pageIndex=1&pageSize=1000`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          const listData = data.data.data;
          const listProduct = [];
          const listCombo = [];
          // filter 2 list by product.isCombo
          listData.forEach((product) => {
            if (product.isCombo) {
              listCombo.push(product);
            } else {
              listProduct.push(product);
            }
          });

          setProducts(listProduct);
          setListCombo(listCombo);
        } else {
          console.error("Error fetching products:", data.messages);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Kết nối tới room "shop" theo shopId
    console.log("Emitting join-shop-topic for shopId:", id);
    socket.emit("join-shop-topic", id);

    // Lắng nghe sự kiện thông báo
    socket.on("order-notification", (message) => {
      console.log("Received order notification:", message);
    });

    return () => {
      socket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, [id, cardId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00cc69" />;
  }

  if (!shopDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Shop details are not available.</Text>
      </View>
    );
  }

  const renderShopDetails = () => (
    <View>
      <Image
        source={{
          uri:
            shopDetails.image ||
            "https://i.pinimg.com/236x/eb/cb/c6/ebcbc6aaa9deca9d6efc1efc93b66945.jpg",
        }}
        style={styles.shopImage}
      />
      <View style={styles.productDescriptionContainer}>
        <Text style={styles.productName}>{shopDetails.name}</Text>

        <Text style={styles.shopHours}>
          {formatOpeningHours(
            shopDetails.from_Hour,
            shopDetails.from_Minune,
            shopDetails.to_Hour,
            shopDetails.to_Minune
          )}
        </Text>
        <Text style={styles.shopHours}>
          Tomorrow's Opening Hours:{" "}
          {formatOpeningHours(
            shopDetails.from_HourTomorow,
            shopDetails.from_MinuneTomorow,
            shopDetails.to_HourTomorow,
            shopDetails.to_MinuneTomorow
          )}
        </Text>
        <Text style={styles.shopAddress}>{shopDetails.address}</Text>
        <Text style={styles.shopDescription}>{shopDetails.description}</Text>
        <Text style={styles.shopPhone}>Phone: {shopDetails.phone}</Text>
        <View style={styles.productDetailsRow}>
          {renderStars(Math.round(shopDetails.rate))}
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => navigation.navigate("Feedback", { shopId: id })}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.feedbackButtonText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Home");
    }
  };

  const handleClickCancelOrder = async () => {
    if (cartId) {
      const token = await AsyncStorage.getItem("userToken");
      const result = await fetch(
        `https://bms-fs-api.azurewebsites.net/api/Cart/DeleteCart?cartId=${cartId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      const resBody = await result.json();
      if (!resBody.isSuccess) {
        console.log("Error: An error occur when click cancel");
        console.log(result);
      }
      await AsyncStorage.removeItem("cartGroupId");
      await AsyncStorage.removeItem("accessTokenGroupId");
      handleBack();
    } else {
      alert("cart id invalid: " + cardId);
    }
  };

  const handleClickOrderForGroup = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("shopId", id);
    const response = await fetch(
      "https://bms-fs-api.azurewebsites.net/api/Cart/ChangeCartToGroup",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const resBody = await response.json();
    if (resBody.isSuccess) {
      const cartId = resBody.data.cartId;
      const accessToken = resBody.data.accessToken;
      const url = `https://bms1dl-ujj3.vercel.app/OrderGroupLink?shopId=${id}&cardId=${cartId}&accessToken=${accessToken}`;
      // copy url to clipboard and alert to noti for user
      Clipboard.setString(url);
      Alert.alert(
        "URL has been copied",
        "Please share this link with your friends"
      );
      setCartId(cartId);
      setIsCreatorCartGroup(true);
    } else {
      Alert.alert("Failed to create Order Group");
    }
  };

  const formatOpeningHours = (fromHour, fromMinute, toHour, toMinute) => {
    return `${fromHour}:${
      fromMinute < 10 ? "0" : ""
    }${fromMinute} - ${toHour}:${toMinute < 10 ? "0" : ""}${toMinute}`;
  };

  const headerHeight = 60; // Adjust this value based on your header's height

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerContainer, { height: headerHeight }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.shopName}>
          {shopDetails.name || "Shop Name Not Available"}
        </Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Checkout", { cart })}
        >
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
          <Text style={styles.cartItemCount}>{cartCount}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        contentInset={{ top: headerHeight }}
      >
        <View>
          <Image source={{ uri: shopDetails.image }} style={styles.shopImage} />
          <View style={styles.productDescriptionContainer}>
            <Text style={styles.productName}>{shopDetails.name}</Text>

            <Text style={styles.shopHours}>
              Today:{" "}
              {formatOpeningHours(
                shopDetails.from_Hour,
                shopDetails.from_Minune,
                shopDetails.to_Hour,
                shopDetails.to_Minune
              )}
            </Text>
            <Text style={styles.shopHours}>
              Tomorrow:{" "}
              {formatOpeningHours(
                shopDetails.from_HourTomorow,
                shopDetails.from_MinuneTomorow,
                shopDetails.to_HourTomorow,
                shopDetails.to_MinuneTomorow
              )}
            </Text>
            <Text style={styles.shopAddress}>{shopDetails.address}</Text>
            <Text style={styles.shopDescription}>
              {shopDetails.description}
            </Text>
            <Text style={styles.shopPhone}>Phone: {shopDetails.phone}</Text>
            <View style={styles.productDetailsRow}>
              {renderStars(Math.round(shopDetails.rate))}
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => navigation.navigate("Feedback", { shopId: id })}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                <Text style={styles.feedbackButtonText}>Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.featuredProduct}>Menu</Text>
        {products &&
          products.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productItem}
              onPress={() => goToProductDetail(item)}
            >
              <Image
                source={{
                  uri:
                    item.images?.[0]?.url || "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {item.name || "Unnamed Product"}
                </Text>
                <Text style={styles.productPrice}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price || 0)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        <Text style={styles.featuredProduct}>Top Combo Deals</Text>
        {listCombo &&
          listCombo.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productItem}
              onPress={() => goToProductDetail(item)}
            >
              <Image
                source={{
                  uri:
                    item.images?.[0]?.url || "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {item.name || "Unnamed Product"}
                </Text>
                <Text style={styles.productPrice}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price || 0)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
      {/* Fixed Button */}
      {(isCreatorCartGroup && (
        <TouchableOpacity
          style={styles.fixedButtonCancel}
          onPress={handleClickCancelOrder}
        >
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
            <Text style={styles.buttonText}>Cancel Order</Text>
          </View>
        </TouchableOpacity>
      )) ||
        (!cardId && !accessToken && (
          <TouchableOpacity
            style={styles.fixedButton}
            onPress={handleClickOrderForGroup}
          >
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faUsers} size={20} color="#fff" />
              <Text style={styles.buttonText}>Order for Group</Text>
            </View>
          </TouchableOpacity>
        ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Platform.OS === "ios" ? 40 : 2,
    paddingHorizontal: 10,
    backgroundColor: "#00cc69",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 1,
  },
  backButton: {
    padding: 10,
  },
  shopName: {
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
  cartItemCount: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 20,
    minHeight: 20,
  },
  shopImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginTop: 25,
  },
  productDescriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  productDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  productDetailsText: {
    marginLeft: 9,
    fontSize: 16,
    color: "#7f8c8d",
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  feedbackButton: {
    marginLeft: 10,
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  feedbackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#00cc69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fixedButton: {
    position: "absolute",
    bottom: 30, // khoảng cách từ đáy màn hình
    right: 20, // khoảng cách từ cạnh phải
    backgroundColor: "#00cc69", // Màu nền của button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15, // Góc bo tròn
    shadowColor: "#000", // Bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Bóng trên Android
    width: 200, // Đặt width nếu muốn kiểm soát chính xác chiều rộng
    height: 50, // Đặt height nếu muốn kiểm soát chính xác chiều cao
  },
  fixedButtonCancel: {
    position: "absolute",
    bottom: 30, // khoảng cách từ đáy màn hình
    right: 20, // khoảng cách từ cạnh phải
    backgroundColor: "red", // Màu nền của button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15, // Góc bo tròn
    shadowColor: "#000", // Bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Bóng trên Android
    width: 180, // Đặt width nếu muốn kiểm soát chính xác chiều rộng
    height: 50, // Đặt height nếu muốn kiểm soát chính xác chiều cao
  },
  buttonContent: {
    flexDirection: "row", // Đặt icon và text nằm ngang
    alignItems: "center", // Căn giữa icon và text
  },
  buttonText: {
    marginLeft: 10,
    color: "#fff", // Màu chữ trắng
    fontSize: 18, // Kích thước chữ
    fontWeight: "bold", // Đậm chữ
    textAlign: "center", // Căn giữa chữ
    lineHeight: 30, // Căn giữa chữ theo chiều dọc trong nút
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5, // Space around the rating
  },
  star: {
    color: "#ccc", // Default star color
    fontSize: 20,
  },
  starFilled: {
    color: "#ffcc00", // Color for filled stars
    fontSize: 20,
  },
  featuredProduct: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Roboto", // Hoặc bất kỳ font nào bạn muốn
  },
  shopHours: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  shopAddress: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  shopDescription: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  shopPhone: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
});
