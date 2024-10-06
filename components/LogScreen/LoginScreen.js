import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để theo dõi xem mật khẩu có đang hiển thị hay không
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/login", // Đổi endpoint thành login
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
        navigation.navigate("Home"); // Điều hướng sang trang Home
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: "https://i.pinimg.com/736x/f5/2d/6f/f52d6faabc235a88e5ba2df70ff7228c.jpg",
        }}
        style={styles.icon}
      />

      <Text style={styles.headerText}>Login to Your Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.textInputPassword}
          secureTextEntry={!showPassword} // Hiển thị hoặc ẩn mật khẩu
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setShowPassword(!showPassword)} // Thay đổi trạng thái xem mật khẩu
        >
          <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁️‍🗨️"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.policyContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.policyText}>
            <Text style={styles.policyLink}>Forgot the password?</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.signInText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: "black",
  },
  icon: {
    width: 300,
    height: 200,
    alignSelf: "center",
    marginBottom: 0,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00cc69",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textInputPassword: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginVertical: 10,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  eyeIcon: {
    fontSize: 24,
    color: "gray",
  },
  policyContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  policyText: {
    fontSize: 14,
    color: "gray",
  },
  policyLink: {
    color: "#00cc69",
  },
  button: {
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "gray",
    marginVertical: 10,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  signInText: {
    textAlign: "center",
    color: "#00cc69",
    fontSize: 16,
    marginTop: 20,
  },
});
