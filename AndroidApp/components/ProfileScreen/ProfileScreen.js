import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

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
  const route = useRoute();

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Logout");
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { data });
  };

  const handleGoToCart = () => {
    navigation.navigate("CartMain");
  };
  const handleGoToPayment = () => {
    navigation.navigate("Payment");
  };


  const handleGoToSettings = () => {
    navigation.navigate("Settings");
  };

  const handleGoToHelpSupport = () => {
    navigation.navigate("HelpSupport");
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  // Update the avatar if it was passed as a parameter
  useEffect(() => {
    if (route.params?.updatedAvatar) {
      setData((prevData) => ({
        ...prevData,
        avatar: route.params.updatedAvatar,
      }));
    }
  }, [route.params?.updatedAvatar]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Image
          source={{
            uri:
              data?.avatar ||
              "https://i.pinimg.com/564x/cf/f7/4e/cff74e044fe8eb2918424b53297bce18.jpg",
          }}
          style={styles.profileImage}
        />
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
          onPress={handleGoToCart}
        />
        <OptionItem
          icon="notifications-outline"
          title="My Notification"
          onPress={() => navigation.navigate("Notifications")}
        />
        <OptionItem
          icon="person-outline"
          title="Edit Profile"
          onPress={handleEditProfile}
        />
        <OptionItem
          icon="card-outline"
          title="Payment"
          onPress={handleGoToPayment}
        />

        <OptionItem
          icon="settings-outline"
          title="Settings"
          onPress={handleGoToSettings}
        />
        <OptionItem
          icon="help-circle-outline"
          title="Help & Support"
          onPress={handleGoToHelpSupport}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "row",
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  profileOptions: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 20,
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  rightText: {
    fontSize: 16,
    color: "#888",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});