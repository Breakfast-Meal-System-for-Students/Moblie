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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

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

  const handleUpdateProfile = async (firstName, lastName, phone) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Account/update-avatar", // Kiểm tra lại URL này
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleUpdateAvatar = async (avatarUri) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", {
        uri: avatarUri,
        type: "image/jpeg", // Đảm bảo đúng định dạng file
        name: "avatar.jpg", // Đảm bảo tên file hợp lệ
      });

      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Account/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Avatar updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update avatar", error); // Thêm thông tin chi tiết để debug
    }
  };

  const pickImage = async () => {
    // Yêu cầu quyền truy cập vào thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Mở thư viện ảnh để người dùng chọn ảnh
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleUpdateAvatar(result.uri); // Gọi hàm cập nhật avatar
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Logout");
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { data, handleUpdateProfile });
  };

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
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          {/* Thêm nút để cập nhật avatar */}
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
        <OptionItem icon="cart-outline" title="My Cart" />
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    left: -260,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  darkModeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
