import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Enter OTP</Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff", // Nền trắng
    justifyContent: "center",
    alignItems: "center",
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
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00cc69",
    marginBottom: 20,
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
    backgroundColor: "#00cc69",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#00cc69",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default OTPScreen;
