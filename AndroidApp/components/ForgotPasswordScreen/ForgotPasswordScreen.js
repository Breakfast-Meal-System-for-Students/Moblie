import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    setIsFormValid(email.trim() !== "");
  }, [email]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/SendOTP",
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
        Alert.alert("Success", "OTP sent successfully!");
        // Navigate to the OTP screen
        await AsyncStorage.setItem("email", email);
        navigation.navigate("OTPScreen", { email }); // Pass the email to the OTP screen
      } else {
        Alert.alert("Error", response.data.messages[0].content);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "An error occurred while sending OTP.");
    } finally {
      setIsProcessing(false);
    }
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
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerText}>Forgot Password</Text>

          <TextInput
            placeholder="Email *"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Pressable
            style={[styles.button, isProcessing && styles.buttonProcessing]}
            onPress={handleSendOTP}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>{isProcessing ? "Processing..." : "Send OTP"}</Text>
          </Pressable>
        </ScrollView>
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
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
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
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
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
  buttonProcessing: {
    backgroundColor: 'gray',
  },
});

