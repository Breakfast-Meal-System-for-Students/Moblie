import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function OTPScreen() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    console.log("Verifying OTP:", otp);

    if (otp === "123456") {
      Alert.alert("Success", "OTP has been successfully reset!");
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", "Your OTP is incorrect. Please try again.");
    }
  };

  const handleResendOtp = () => {
    // Giả lập gửi lại OTP
    Alert.alert("Success", "A new OTP has been sent to your email address.");
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
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.link}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#009900",
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
    backgroundColor: "#33CC33",
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
    color: "#009900",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default OTPScreen;
