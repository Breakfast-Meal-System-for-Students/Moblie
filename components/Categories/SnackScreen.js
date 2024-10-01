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

const snackData = [
  {
    id: "1",
    name: "Chips",
    distance: "500 m",
    rating: "4.8",
    reviews: "(1.2k)",
    price: "$1.50",
    deliveryFee: "$0.50",
    image:
      "https://i.pinimg.com/564x/f7/ec/13/f7ec1323a0e118481da37c0fdd17583c.jpg",
  },
  {
    id: "2",
    name: "Popcorn",
    distance: "700 m",
    rating: "4.7",
    reviews: "(900)",
    price: "$2.00",
    deliveryFee: "$0.30",
    image:
      "https://i.pinimg.com/564x/51/14/17/5114171896082a4871ff0fe22f2d70ef.jpg",
  },
  {
    id: "3",
    name: "Pretzels",
    distance: "1.0 km",
    rating: "4.6",
    reviews: "(1.1k)",
    price: "$2.50",
    deliveryFee: "$0.70",
    image:
      "https://i.pinimg.com/564x/26/bb/33/26bb33673489b664be08b6e538d68a15.jpg",
  },
  {
    id: "4",
    name: "Nachos",
    distance: "1.2 km",
    rating: "4.9",
    reviews: "(1.5k)",
    price: "$3.00",
    deliveryFee: "$0.80",
    image:
      "https://i.pinimg.com/564x/f7/ec/13/f7ec1323a0e118481da37c0fdd17583c.jpg",
  },
  {
    id: "5",
    name: "Chocolate Bar",
    distance: "2.0 km",
    rating: "4.5",
    reviews: "(2.0k)",
    price: "$1.80",
    deliveryFee: "$1.00",
    image:
      "https://i.pinimg.com/564x/51/14/17/5114171896082a4871ff0fe22f2d70ef.jpg",
  },
];

const SnackScreen = ({ navigation }) => {
  const renderSnackItem = ({ item }) => (
    <View style={styles.snackContainer}>
      <Image source={{ uri: item.image }} style={styles.snackImage} />
      <View style={styles.snackDetails}>
        <Text style={styles.snackName}>{item.name}</Text>
        <Text style={styles.snackDistance}>
          {item.distance}{" "}
          <FontAwesomeIcon icon={faStar} color="orange" size={14} />{" "}
          {item.rating} <Text style={styles.snackReviews}>{item.reviews}</Text>
        </Text>
        <View style={styles.snackPriceContainer}>
          <Text style={styles.snackPrice}>{item.price}</Text>
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
        <Text style={styles.headerTitle}>Snacks</Text>
      </View>
      <FlatList
        data={snackData}
        renderItem={renderSnackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.snackList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  backButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  snackList: {
    paddingBottom: 20,
  },
  snackContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  snackImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  snackDetails: {
    flex: 1,
  },
  snackName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  snackDistance: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  snackReviews: {
    fontSize: 12,
    color: "#999",
  },
  snackPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  snackPrice: {
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

export default SnackScreen;
