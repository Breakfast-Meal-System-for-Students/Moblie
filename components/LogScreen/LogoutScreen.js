import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Đảm bảo rằng bạn dùng đúng tên token
      await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Main");
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="log-out-outline" size={100} color="#ff4d4d" />
      <Text style={styles.title}>Are you sure you want to log out?</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
});

export default LogoutScreen;
