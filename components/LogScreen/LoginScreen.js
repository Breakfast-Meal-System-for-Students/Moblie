import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.data.isSuccess) {
        await AsyncStorage.setItem("userToken", response.data.data.token);
        console.log(response.data.data.token);
        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.textInput}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.formButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </Pressable>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Do not have an account? </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  textInput: {
    borderWidth: 1, // Thêm khung cho text input
    borderColor: "gray",
    borderRadius: 5, // Bo tròn góc của input
    marginVertical: 10,
    fontSize: 16,
    padding: 10, // Thêm khoảng cách trong input
    backgroundColor: "white", // Thêm màu nền trắng cho input
  },
  formButton: {
    backgroundColor: "#00cc69",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  linkContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  link: {
    color: "#00cc69",
    fontSize: 16,
    marginVertical: 5,
  },
});
