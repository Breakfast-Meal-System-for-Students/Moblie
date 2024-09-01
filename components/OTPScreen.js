import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function OTPScreen() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    // Handle OTP verification logic here
    console.log("Verifying OTP:", otp);
    // After successful verification, navigate to the reset password screen
    navigation.navigate("ResetPassword"); // Giả sử bạn có một trang đặt lại mật khẩu
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/4e/a5/9f/4ea59fb67c528f2c78a30d4d366bf536.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.description}>
            Please enter the OTP sent to your email address.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
          <View style={styles.linkContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.link}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay on background image
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400, // Adjust maximum width of the box
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent white background
    borderRadius: 10, // Rounded corners of the box
    padding: 20,
    shadowColor: "#000", // Shadow for the box
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Elevation for the box on Android
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#009900", // Consistent color with other screens
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#33CC33", // Consistent color with login button
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: "#009900", // Consistent color with other links
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default OTPScreen;
