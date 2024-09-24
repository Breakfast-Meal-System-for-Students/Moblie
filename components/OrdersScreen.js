import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const orders = {
  active: [
    {
      id: "1",
      image:
        "https://i.pinimg.com/564x/77/d8/9a/77d89a30e447d14411a49a3f0f826dce.jpg", // thay bằng URL hình ảnh thật
      name: "Margherita Pizza",
      address: "123 Main St, Cityville",
      price: "$29.99",
      status: "Paid",
    },
    {
      id: "2",
      image:
        "https://i.pinimg.com/564x/43/7c/44/437c447768d443d33d9ee3743e87dd08.jpg",
      name: "Cheeseburger",
      address: "456 Oak St, Townsville",
      price: "$19.99",
      status: "Paid",
    },
    {
      id: "3",
      image:
        "https://i.pinimg.com/564x/28/e6/7c/28e67ca4091128760bf872145354029b.jpg",
      name: "Caesar Salad",
      address: "789 Pine St, Villagetown",
      price: "$24.99",
      status: "Paid",
    },
  ],
  completed: [
    {
      id: "4",
      image:
        "https://i.pinimg.com/236x/7a/15/19/7a15191ff01d1781cff7fce417c693b4.jpg",
      name: "Mushroom Swiss Burger",
      address: "789 Pine St, Villagetown",
      price: "$129.99",
      status: "Paid",
    },
    {
      id: "5",
      image:
        "https://i.pinimg.com/236x/39/d5/5e/39d55ebc2cf2cf4e38574dd2d85a0d0f.jpg",
      name: "Garlic Breadsticks",
      address: "90 Elm St, Hamlet",
      price: "$199.99",
      status: "Paid",
    },
    {
      id: "6",
      image:
        "https://i.pinimg.com/564x/a8/e4/67/a8e46738ce2fe13e83c3e3f548214405.jpg",
      name: "Cheeseburger",
      address: "321 Maple St, Suburbia",
      price: "$349.99",
      status: "Paid",
    },
  ],
  cancelled: [
    {
      id: "7",
      image:
        "https://i.pinimg.com/236x/a6/8b/61/a68b61bff6c375103e1fa96385d34ecb.jpg",
      name: "Vegetarian Pizza",
      address: "789 Pine St, Villagetown",
      price: "$129.99",
      status: "Refunded",
    },
    {
      id: "8",
      image:
        "https://i.pinimg.com/236x/cd/7b/33/cd7b33fc8428af88d25690996e85cb5d.jpg",
      name: "Caesar Salad",
      address: "90 Elm St, Hamlet",
      price: "$199.99",
      status: "Refunded",
    },
    {
      id: "9",
      image:
        "https://i.pinimg.com/236x/32/12/7b/32127bce596d98a351f59023b9c4e549.jpg",
      name: "BBQ Chicken Wings",
      address: "321 Maple St, Suburbia",
      price: "$349.99",
      status: "Refunded",
    },
  ],
};

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [cart, setCart] = useState({}); // Giả lập giỏ hàng
  const navigation = useNavigation(); // Lấy navigation để điều hướngs
  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderName}>{item.name}</Text>
        <Text style={styles.orderAddress}>{item.address}</Text>
        <Text style={styles.orderPrice}>{item.price}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{item.status}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              {selectedTab === "active" ? "Cancel Booking" : "View"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View E-Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Thêm Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.shopName}>My Orders</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Checkout", { cart })} // Điều hướng tới CheckoutScreen với dữ liệu giỏ hàng
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

      {/* Tab điều hướng */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "active" && styles.activeTab]}
          onPress={() => setSelectedTab("active")}
        >
          <Text style={styles.tabText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "completed" && styles.activeTab]}
          onPress={() => setSelectedTab("completed")}
        >
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "cancelled" && styles.activeTab]}
          onPress={() => setSelectedTab("cancelled")}
        >
          <Text style={styles.tabText}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders[selectedTab]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00cc69",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartItemCount: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  tab: {
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00cc69",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 16,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderAddress: {
    fontSize: 14,
    color: "#555",
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00cc69",
    marginVertical: 8,
  },
  statusContainer: {
    backgroundColor: "#00cc69",
    borderRadius: 10,
    padding: 4,
    alignSelf: "flex-start",
  },
  status: {
    color: "#fff",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#00cc69",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
