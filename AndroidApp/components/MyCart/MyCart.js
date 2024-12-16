import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // Import thư viện ImagePicker

function OptionItem({ icon, title, onPress, rightText }) {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={24} color="black" />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      <Ionicons name="chevron-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const handleGetUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const instance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await instance.get(
        "https://bms-fs-api.azurewebsites.net/api/Account/my-profile"
      );
      setData(response.data.data);
    } catch (error) {
      console.log("response error", error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("Logout");
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { data });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={() => {
            /* Thêm logic cập nhật avatar */
          }}
        >
          <Image
            source={{
              uri:
                data?.avatar ||
                "https://i.pinimg.com/564x/cf/f7/4e/cff74e044fe8eb2918424b53297bce18.jpg",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.profileName}>{`${data?.firstName || "no"} ${
          data?.lastName || "no"
        }`}</Text>
        <Text style={styles.profileEmail}>{`${
          data?.phone || "No phone available"
        }`}</Text>
      </View>

      <ScrollView style={styles.profileOptions}>
        <OptionItem
          icon="cart-outline"
          title="My Cart"
          onPress={() => navigation.navigate("MyCart")}
        />
        <OptionItem icon="notifications-outline" title="My Notification" />
        <OptionItem icon="location-outline" title="Address" />
        <OptionItem
          icon="person-outline"
          title="Edit Profile"
          onPress={handleEditProfile}
        />
        <OptionItem icon="notifications-outline" title="Notification" />
        <OptionItem icon="card-outline" title="Payment" />
        <OptionItem icon="lock-closed-outline" title="Security" />
        <OptionItem
          icon="globe-outline"
          title="Language & Region"
          rightText="English (US)"
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
  },
  quantityContainer: {
    marginTop: 5,
  },
  quantityText: {
    fontSize: 14,
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },
  checkoutButton: {
    backgroundColor: "#00c853",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
