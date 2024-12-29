import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const CheckOTP = async (email, otp, navigation) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oTP", otp);

    const response = await axios.post(
      "https://bms-fs-api.azurewebsites.net/api/Auth/CheckOTP",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "*/*",
          Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Replace with your actual token
        },
      }
    );

    if (response.data.isSuccess) {
      Alert.alert("Success", "OTP verified successfully!");
      // Navigate to Reset Password screen
      navigation.navigate("ResetPassword", { email }); // Pass the email to the Reset Password screen
    } else {
      Alert.alert("Error", response.data.messages[0].content);
    }
  } catch (error) {
    console.error("Error checking OTP:", error);
    Alert.alert("Error", "An error occurred while verifying OTP.");
  }
};

function OTPScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; // Get the email passed from ForgotPasswordScreen
  const [otp, setOtp] = useState("");
  const { width } = Dimensions.get("window");

  const handleVerifyOtp = () => {
    CheckOTP(email, otp, navigation);
  };

  const handleResendOtp = () => {
    Alert.alert("Success", "A new OTP has been sent to your email address.");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/564x/22/a1/55/22a155dbc71897dab5b766dcce874973.jpg",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
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
            placeholderTextColor="#888"
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
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
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
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default OTPScreen;