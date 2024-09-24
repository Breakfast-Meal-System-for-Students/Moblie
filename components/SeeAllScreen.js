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

const allItemsData = [
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
    name: "Burger",
    distance: "700 m",
    rating: "4.7",
    reviews: "(1.5k)",
    price: "$5.50",
    deliveryFee: "$1.20",
    image:
      "https://i.pinimg.com/564x/2b/55/4b/2b554b83d60ffce10f163f9f666e509b.jpg",
  },
  {
    id: "3",
    name: "Chocolate Cake",
    distance: "900 m",
    rating: "4.9",
    reviews: "(2.1k)",
    price: "$6.00",
    deliveryFee: "$1.20",
    image:
      "https://i.pinimg.com/564x/51/14/17/5114171896082a4871ff0fe22f2d70ef.jpg",
  },
  // Add more items from drinks, food, cakes, and snacks
];

const SeeAllScreen = ({ navigation }) => {
  const renderAllItems = ({ item }) => (
    <View style={styles.allItemsContainer}>
      <Image source={{ uri: item.image }} style={styles.allItemsImage} />
      <View style={styles.allItemsDetails}>
        <Text style={styles.allItemsName}>{item.name}</Text>
        <Text style={styles.allItemsDistance}>
          {item.distance}{" "}
          <FontAwesomeIcon icon={faStar} color="orange" size={14} />{" "}
          {item.rating}{" "}
          <Text style={styles.allItemsReviews}>{item.reviews}</Text>
        </Text>
        <View style={styles.allItemsPriceContainer}>
          <Text style={styles.allItemsPrice}>{item.price}</Text>
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
        <Text style={styles.headerTitle}>See All</Text>
      </View>
      <FlatList
        data={allItemsData}
        renderItem={renderAllItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.allItemsList}
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
  allItemsList: {
    paddingBottom: 20,
  },
  allItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  allItemsImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  allItemsDetails: {
    flex: 1,
  },
  allItemsName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  allItemsDistance: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  allItemsReviews: {
    fontSize: 12,
    color: "#999",
  },
  allItemsPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  allItemsPrice: {
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

export default SeeAllScreen;
