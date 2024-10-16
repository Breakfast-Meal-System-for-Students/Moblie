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
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    const shopEmails = ["shop@gmail.com", "shop1@gmail.com"];
    if (shopEmails.includes(email)) {
      Alert.alert("Error", "This email is not allowed to log in.");
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
        // Reset the navigation stack to prevent going back to the login screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }], // Navigate to the Home screen
        });
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
      {/* Hình nền */}
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/564x/22/a1/55/22a155dbc71897dab5b766dcce874973.jpg",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Lớp phủ màu */}
        <View style={styles.overlay} />

        {/* Nội dung chính */}
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Image
            source={{
              uri: "https://i.pinimg.com/474x/dc/f3/93/dcf3934512c6f8f2a107005eca1ab9de.jpg",
            }}
            style={[
              styles.icon,
              {
                width: width * 0.4, // điều chỉnh kích thước logo theo ý muốn
                height: width * 0.4,
                borderRadius: (width * 0.4) / 2, // đặt bán kính để tạo thành hình tròn
              },
            ]}
          />

          <Text style={styles.headerText}>Login to Your Account</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.textInputPassword}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.policyContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.policyText}>
                <Text style={styles.policyLink}>Forgot the password?</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signInText}>
              Don’t have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Lớp phủ màu đen 50% trong suốt
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    zIndex: 1, // Đặt ở phía trên lớp phủ
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: "white",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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
    color: "white",
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
  signInText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginTop: 20,
  },
});
