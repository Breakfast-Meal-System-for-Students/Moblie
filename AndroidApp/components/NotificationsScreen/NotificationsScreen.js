import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          "https://bms-fs-api.azurewebsites.net/api/Notification/GetNotificationForUser",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.isSuccess) {
          setNotifications(data.data.data);
        } else {
          setError("Failed to load notifications");
        }
      } catch (error) {
        setError("An error occurred while fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.status === 1 ? styles.unreadNotification : styles.readNotification,
      ]}
    >
      <Image source={{ uri: item.shopImage }} style={styles.shopImage} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationMessage}>{item.object}</Text>
        <Text style={styles.notificationDetails}>
          Order ID: {item.orderId} | Shop: {item.shopName}
        </Text>
        <Text style={styles.notificationTime}>
          Status: {item.status === 1 ? "Unread" : "Read"} | Title: {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc69" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId}
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
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00cc69",
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  unreadNotification: {
    backgroundColor: "#e0f7e8", // Màu nền cho thông báo chưa đọc
  },
  readNotification: {
    backgroundColor: "#ffffff", // Màu nền cho thông báo đã đọc
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notificationDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  clearButton: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#00cc69",
    margin: 16,
    borderRadius: 10,
  },
  clearText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
