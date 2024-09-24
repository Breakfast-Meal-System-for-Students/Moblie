import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faHeart, faBiking } from "@fortawesome/free-solid-svg-icons";

const drinksData = [
  {
    id: "1",
    name: "Coca Cola",
    distance: "500 m",
    rating: "4.8",
    reviews: "(2.3k)",
    price: "$2.00",
    deliveryFee: "$0.50",
    image:
      "https://i.pinimg.com/564x/f7/ec/13/f7ec1323a0e118481da37c0fdd17583c.jpg",
  },
  {
    id: "2",
    name: "Pepsi",
    distance: "700 m",
    rating: "4.6",
    reviews: "(1.9k)",
    price: "$1.80",
    deliveryFee: "$0.30",
    image:
      "https://i.pinimg.com/564x/51/14/17/5114171896082a4871ff0fe22f2d70ef.jpg",
  },
  {
    id: "3",
    name: "Orange Juice",
    distance: "900 m",
    rating: "4.7",
    reviews: "(2.5k)",
    price: "$3.00",
    deliveryFee: "$1.00",
    image:
      "https://i.pinimg.com/564x/26/bb/33/26bb33673489b664be08b6e538d68a15.jpg",
  },
  {
    id: "4",
    name: "Lemonade",
    distance: "1.2 km",
    rating: "4.9",
    reviews: "(3.2k)",
    price: "$2.50",
    deliveryFee: "$0.70",
    image:
      "https://i.pinimg.com/564x/f7/ec/13/f7ec1323a0e118481da37c0fdd17583c.jpg",
  },
  {
    id: "5",
    name: "Iced Coffee",
    distance: "2.0 km",
    rating: "4.5",
    reviews: "(1.1k)",
    price: "$3.50",
    deliveryFee: "$1.20",
    image:
      "https://i.pinimg.com/564x/51/14/17/5114171896082a4871ff0fe22f2d70ef.jpg",
  },
];

const DrinkScreen = ({ navigation }) => {
  const renderDrinkItem = ({ item }) => (
    <View style={styles.drinkContainer}>
      <Image source={{ uri: item.image }} style={styles.drinkImage} />
      <View style={styles.drinkDetails}>
        <Text style={styles.drinkName}>{item.name}</Text>
        <Text style={styles.drinkDistance}>
          {item.distance}{" "}
          <FontAwesomeIcon icon={faStar} color="orange" size={14} />{" "}
          {item.rating} <Text style={styles.drinkReviews}>{item.reviews}</Text>
        </Text>
        <View style={styles.drinkPriceContainer}>
          <Text style={styles.drinkPrice}>{item.price}</Text>
          <View style={styles.deliveryFeeContainer}>
            <FontAwesomeIcon icon={faBiking} color="green" size={14} />
            <Text style={styles.deliveryFee}>{item.deliveryFee}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <FontAwesomeIcon icon={faHeart} color="red" size={24} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drink</Text>
      </View>

      <FlatList
        data={drinksData}
        renderItem={renderDrinkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.drinkList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Để tiêu đề Drink ở giữa và nút quay lại ở bên trái
    backgroundColor: "#00cc69", // Màu nền giống phần headerContainer
    padding: 16, // Cách đều các phần tử trong header
  },
  backButton: {
    color: "#fff", // Màu trắng giống với phần icon
    fontSize: 24, // Kích thước lớn cho dấu "<"
    fontWeight: "bold", // In đậm cho dấu "<"
  },
  headerTitle: {
    fontSize: 20, // Kích thước chữ tiêu đề
    fontWeight: "bold", // In đậm tiêu đề
    color: "#fff", // Màu trắng cho tiêu đề
  },
  drinkList: {
    paddingBottom: 20,
  },
  drinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  drinkImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  drinkDetails: {
    flex: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  drinkDistance: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  drinkReviews: {
    fontSize: 12,
    color: "#999",
  },
  drinkPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drinkPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  deliveryFeeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryFee: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
});

export default DrinkScreen;
