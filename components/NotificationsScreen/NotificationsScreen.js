import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform, // Import Platform here
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const notifications = [
  {
    id: "1",
    icon: "mail-outline",
    message: "Kathryn sent you a message",
    time: "2 months ago",
  },
  {
    id: "2",
    icon: "checkmark-circle-outline",
    message: "Congratulations! Order Successful",
    time: "2 months ago",
    details: "You have successfully ordered a pizza. Enjoy the service!",
  },
  {
    id: "3",
    icon: "gift-outline",
    message: "New Services Available!",
    time: "2 months ago",
    details:
      "You can now make multiple orders at once. You can also cancel your order.",
  },
  {
    id: "4",
    icon: "pricetag-outline",
    message: "Get 20% Discount for your next order!",
    time: "2 months ago",
    details: "For all orderings without requirements",
  },
  {
    id: "5",
    icon: "restaurant-outline",
    message: "New Category foods available!",
    time: "2 months ago",
    details: "We have added new service. Enjoy our new service!",
  },
  {
    id: "6",
    icon: "card-outline",
    message: "Credit card successfully connected!",
    time: "2 months ago",
    details: "Credit card has been successfully linked.",
  },
  {
    id: "7",
    icon: "mail-outline",
    message: "Julia sent you a message",
    time: "2 months ago",
  },
  {
    id: "8",
    icon: "mail-outline",
    message: "Joanna sent you a message",
    time: "2 months ago",
  },
  {
    id: "9",
    icon: "mail-outline",
    message: "Lilia sent you a message",
    time: "2 months ago",
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation(); // Lấy navigation để điều hướng

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={24} color="black" />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        {item.details && (
          <Text style={styles.notificationDetails}>{item.details}</Text>
        )}
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thêm Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "row",
    justifyContent: "space-between",
    backgroundColor: "#00cc69",
    paddingTop: Platform.OS === "ios" ? 50 : 12, // Increased padding for iOS devices
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00cc69",
    borderRadius: 20,
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  clearButton: {
    padding: 12,
    alignItems: "center",
  },
  clearText: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
});
